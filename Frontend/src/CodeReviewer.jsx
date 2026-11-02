import { useMemo, useRef, useState } from 'react'
import Editor from "react-simple-code-editor"
import axios from 'axios'
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import prism from "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-markup-templating"
import "prismjs/components/prism-php"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-sql"
import Icon from './components/Icon'
import Logo from './components/Logo'
import { parseReview, countBySeverity, SEVERITY_LABEL } from './reviewParser'
import './CodeReviewer.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const DEFAULT_CODE = `function fetchUser(id) {
  // TODO: fix this later
  const query = "SELECT * FROM users WHERE id = " + id
  return db.execute(query)
}`

// Language only drives editor highlighting + file name; the API payload is unchanged.
const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: 'js' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
  { id: 'c', label: 'C', ext: 'c' },
  { id: 'csharp', label: 'C#', ext: 'cs' },
  { id: 'go', label: 'Go', ext: 'go' },
  { id: 'rust', label: 'Rust', ext: 'rs' },
  { id: 'php', label: 'PHP', ext: 'php' },
  { id: 'ruby', label: 'Ruby', ext: 'rb' },
  { id: 'sql', label: 'SQL', ext: 'sql' },
]

const CHECKS = [
  { icon: 'bug', label: 'Bugs & logic errors' },
  { icon: 'shield', label: 'Security vulnerabilities' },
  { icon: 'zap', label: 'Performance' },
  { icon: 'layers', label: 'Readability & best practices' },
]

const SEVERITY_ICON = {
  critical: 'xCircle',
  warning: 'alert',
  success: 'checkCircle',
  info: 'info',
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

function hastText(node) {
  if (!node) return ''
  if (node.type === 'text') return node.value
  return (node.children || []).map(hastText).join('')
}

function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const copy = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    })
  }
  return [copied, copy]
}

function CodeBlock({ node, children }) {
  const [copied, copy] = useCopy()
  const codeEl = node?.children?.find((c) => c.tagName === 'code')
  const cls = codeEl?.properties?.className || []
  const lang = cls.find((c) => String(c).startsWith('language-'))?.slice(9)

  return (
    <div className="cr-codeblock">
      <div className="cr-codeblock-bar">
        <span>{lang || 'code'}</span>
        <button
          className={`cr-codeblock-copy ${copied ? 'is-copied' : ''}`}
          onClick={() => copy(hastText(codeEl))}
          aria-label="Copy code snippet"
        >
          <Icon name={copied ? 'check' : 'copy'} size={12} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  )
}

const MD_COMPONENTS = { pre: CodeBlock }

function ReviewCard({ section, index }) {
  return (
    <article
      className={`cr-card sev-${section.severity}`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <header className="cr-card-head">
        <span className="cr-card-icon"><Icon name={SEVERITY_ICON[section.severity]} size={15} /></span>
        <h3 className="cr-card-title">{section.title}</h3>
        <span className="sev-badge">{SEVERITY_LABEL[section.severity]}</span>
      </header>
      {section.body && (
        <div className="cr-card-body cr-md">
          <Markdown rehypePlugins={[rehypeHighlight]} components={MD_COMPONENTS}>
            {section.body}
          </Markdown>
        </div>
      )}
    </article>
  )
}

function CodeReviewer({ onBack }) {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState('javascript')
  const [review, setReview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [copied, copy] = useCopy()
  const outputRef = useRef(null)

  const lang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0]
  const lines = code.split('\n')
  const lineCount = lines.length

  const sections = useMemo(() => parseReview(review), [review])
  const counts = useMemo(() => countBySeverity(sections), [sections])

  async function reviewCode() {
    if (!code.trim() || loading) return
    setLoading(true)
    setReview('')
    setError('')
    setHasReviewed(true)

    // On stacked (mobile) layouts, bring the result panel into view.
    if (window.matchMedia('(max-width: 860px)').matches) {
      requestAnimationFrame(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/get-review`, { code })
      setReview(response.data)
    } catch (err) {
      console.error('Error reviewing code:', err)
      setError(
        `Could not reach the review service at ${API_BASE_URL}. If this is the deployed site, make sure Vercel has VITE_API_URL set to your Render backend URL and that the frontend was redeployed after saving the variable.`
      )
    } finally {
      setLoading(false)
    }
  }

  function onEditorKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      reviewCode()
    }
  }

  const highlight = (val) => {
    const grammar = prism.languages[language] || prism.languages.javascript
    return prism.highlight(val, grammar, language)
  }

  const showEmpty = !hasReviewed
  const showResult = !loading && !error && review

  return (
    <div className="cr-app">

      {/* ── Header ── */}
      <header className="cr-header">
        <div className="cr-header-left">
          <button className="btn btn-ghost btn-sm cr-back" onClick={onBack} aria-label="Back to home">
            <Icon name="arrowLeft" size={15} />
            <span className="cr-back-label">Back</span>
          </button>
          <span className="cr-divider" aria-hidden="true" />
          <Logo size="sm" />
          <nav className="cr-crumbs" aria-label="Breadcrumb">
            <span className="cr-crumb-sep">/</span>
            <span>Workspace</span>
            <span className="cr-crumb-sep">/</span>
            <span className="cr-crumb-current">Review</span>
          </nav>
        </div>

        <div className="cr-header-right">
          <span className="cr-ai-badge">
            <span className={`status-dot ${loading ? 'is-busy' : ''}`} />
            {loading ? 'Analyzing' : 'AI Powered'}
          </span>
        </div>
      </header>

      {/* ── Workspace ── */}
      <main className="cr-body">

        {/* Editor */}
        <section className="cr-panel cr-editor-panel" aria-label="Code editor">
          <div className="cr-toolbar">
            <div className="cr-file-tab">
              <Icon name="file" size={13} />
              <span>main.{lang.ext}</span>
            </div>

            <div className="cr-toolbar-actions">
              <label className="sr-only" htmlFor="cr-lang">Language</label>
              <select
                id="cr-lang"
                className="select cr-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>

              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => setCode('')}
                disabled={!code || loading}
                aria-label="Clear editor"
                title="Clear editor"
              >
                <Icon name="trash" size={15} />
              </button>

              <button
                className="btn btn-primary btn-sm cr-review-btn"
                onClick={reviewCode}
                disabled={loading || !code.trim()}
              >
                {loading ? <span className="spinner" /> : <Icon name="sparkles" size={15} />}
                {loading ? 'Analyzing…' : 'Review Code'}
              </button>
            </div>
          </div>

          <div className="cr-editor-scroll" onKeyDown={onEditorKeyDown}>
            <div className="cr-editor-inner">
              <label className="sr-only" htmlFor="cr-code">Code to review</label>
              <div className="cr-gutter" aria-hidden="true">
                {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
              </div>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlight}
                padding={16}
                placeholder={`// Paste your ${lang.label} code here…`}
                className="cr-editor"
                textareaClassName="cr-editor-textarea"
                preClassName="cr-editor-pre"
                textareaId="cr-code"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  lineHeight: '21px',
                  minHeight: '100%',
                }}
              />
            </div>
          </div>

          <footer className="cr-statusbar">
            <span className="cr-status-item">
              <Icon name="code" size={12} />
              {lang.label}
            </span>
            <span className="cr-status-item">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
            <span className="cr-status-item cr-hide-sm">{code.length} chars</span>
            <span className="cr-status-hint cr-hide-sm">
              <kbd className="kbd">{isMac ? '⌘' : 'Ctrl'}</kbd>
              <kbd className="kbd">Enter</kbd>
              to review
            </span>
          </footer>
        </section>

        {/* Review */}
        <section className="cr-panel cr-output-panel" aria-label="AI review" ref={outputRef}>
          <div className="cr-toolbar">
            <div className="cr-panel-title">
              <Icon name="checkCircle" size={14} />
              AI Review
            </div>

            <div className="cr-toolbar-actions">
              {showResult && (
                <button
                  className={`btn btn-secondary btn-sm ${copied ? 'is-copied' : ''}`}
                  onClick={() => copy(review)}
                >
                  <Icon name={copied ? 'check' : 'copy'} size={13} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
          </div>

          <div className="cr-output-scroll" aria-live="polite" aria-busy={loading}>
            {showEmpty && (
              <div className="cr-state cr-empty">
                <div className="cr-state-icon"><Icon name="search" size={24} strokeWidth={1.5} /></div>
                <h2 className="cr-state-title">Ready to review</h2>
                <p className="cr-state-sub">
                  Paste your code in the editor and click <strong>Review Code</strong> to get
                  AI-powered feedback on bugs, security and best practices.
                </p>
                <ul className="cr-checks">
                  {CHECKS.map((c) => (
                    <li key={c.label}>
                      <Icon name={c.icon} size={14} />
                      {c.label}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary cr-empty-cta" onClick={reviewCode} disabled={!code.trim()}>
                  <Icon name="sparkles" size={15} />
                  Review sample code
                </button>
              </div>
            )}

            {loading && (
              <div className="cr-loading">
                <div className="cr-loading-head">
                  <span className="spinner" />
                  <div>
                    <p className="cr-loading-title">Analyzing your code…</p>
                    <p className="cr-loading-sub">Checking for bugs, security issues &amp; improvements</p>
                  </div>
                </div>
                {[0, 1, 2].map((i) => (
                  <div className="cr-skeleton" key={i}>
                    <div className="cr-sk-line w-30" />
                    <div className="cr-sk-line w-90" />
                    <div className="cr-sk-line w-70" />
                    {i === 0 && <div className="cr-sk-block" />}
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="cr-state cr-error" role="alert">
                <div className="cr-state-icon"><Icon name="alertCircle" size={24} strokeWidth={1.5} /></div>
                <h2 className="cr-state-title">Connection error</h2>
                <p className="cr-state-sub">{error}</p>
                <button className="btn btn-secondary" onClick={reviewCode}>
                  <Icon name="refresh" size={14} />
                  Try again
                </button>
              </div>
            )}

            {showResult && (
              <div className="cr-results">
                <div className="cr-summary">
                  <span className="cr-summary-label">
                    <Icon name="checkCircle" size={14} />
                    Review complete
                  </span>
                  <div className="cr-summary-chips">
                    {['critical', 'warning', 'success', 'info'].map((s) =>
                      counts[s] ? (
                        <span key={s} className={`cr-chip sev-${s}`}>
                          <span className="cr-chip-dot" />
                          {counts[s]} {SEVERITY_LABEL[s]}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>

                {sections.map((s, i) => <ReviewCard key={i} section={s} index={i} />)}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CodeReviewer
