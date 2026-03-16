import { useState } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import axios from 'axios'
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import prism from "prismjs"
import './CodeReviewer.css'

const DEFAULT_CODE = `function fetchUser(id) {
  // TODO: fix this later
  const query = "SELECT * FROM users WHERE id = " + id
  return db.execute(query)
}`

function CodeReviewer({ onBack }) {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [copied, setCopied] = useState(false)

  async function reviewCode() {
    if (!code.trim() || loading) return
    setLoading(true)
    setReview('')
    setHasReviewed(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/ai/get-review`, { code })
      setReview(response.data)
    } catch (error) {
      console.error('Error reviewing code:', error)
      setReview(
        '**Connection Error**\n\nCould not reach the review service. Please make sure the backend server is running on port 3000 and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function copyReview() {
    if (!review) return
    navigator.clipboard.writeText(review).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const lineCount = code.split('\n').length

  return (
    <div className="cr-app">

      {/* ── Header ── */}
      <header className="cr-header">
        <div className="cr-header-left">
          <button className="cr-back-btn" onClick={onBack}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>

          <div className="cr-logo">
            <span className="cr-logo-icon">&lt;/&gt;</span>
            <span>CodeReview<span className="cr-logo-ai">AI</span></span>
          </div>
        </div>

        <div className="cr-header-right">
          <div className="cr-ai-badge">
            <span className="cr-badge-dot" />
            AI Powered
          </div>
        </div>
      </header>

      {/* ── Split Panel ── */}
      <div className="cr-body">

        {/* Left — Editor */}
        <div className="cr-editor-panel">
          <div className="cr-panel-header">
            <div className="cr-panel-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
              Code Editor
            </div>
            <div className="cr-lang-badge">JavaScript</div>
          </div>

          <div className="cr-editor-scroll">
            <Editor
              value={code}
              onValueChange={val => setCode(val)}
              highlight={val => prism.highlight(val, prism.languages.javascript, 'javascript')}
              padding={20}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: '13.5px',
                minHeight: '100%',
                backgroundColor: 'transparent',
                color: '#c9d5e3',
              }}
              textareaClassName="cr-editor-textarea"
              preClassName="cr-editor-pre"
            />
          </div>

          <div className="cr-editor-footer">
            <span className="cr-line-count">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/>
              </svg>
              {lineCount} {lineCount === 1 ? 'line' : 'lines'}
            </span>

            <button
              className={`cr-review-btn ${loading ? 'cr-btn-loading' : ''}`}
              onClick={reviewCode}
              disabled={loading || !code.trim()}
            >
              {loading ? (
                <>
                  <span className="cr-spinner" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Review Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right — Output */}
        <div className="cr-output-panel">
          <div className="cr-panel-header">
            <div className="cr-panel-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Review
            </div>
            {review && !loading && (
              <button className={`cr-copy-btn ${copied ? 'cr-copied' : ''}`} onClick={copyReview}>
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div className="cr-output-scroll">
            {!hasReviewed && (
              <div className="cr-placeholder">
                <div className="cr-placeholder-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p className="cr-placeholder-title">Ready to review</p>
                <p className="cr-placeholder-sub">
                  Paste your code on the left and click <strong>Review Code</strong> to get
                  AI-powered feedback on bugs, security, and best practices.
                </p>
              </div>
            )}

            {loading && (
              <div className="cr-loading-state">
                <div className="cr-loading-ring">
                  <span /><span /><span /><span />
                </div>
                <p className="cr-loading-title">Analyzing your code…</p>
                <p className="cr-loading-sub">Checking for bugs, security issues &amp; improvements</p>
              </div>
            )}

            {!loading && review && (
              <div className="cr-review-content">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review}
                </Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeReviewer
