import { useCallback, useEffect, useRef, useState } from 'react'
import prism from 'prismjs'
import Icon from './components/Icon'
import Logo from './components/Logo'
import './LandingPage.css'

const NAV_LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'C#']

const PREVIEW_CODE = `import { db } from './db'

export async function fetchUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id
  const user = await db.execute(query)

  // TODO: handle missing user
  return user.rows[0]
}`

const PREVIEW_LINES = prism
  .highlight(PREVIEW_CODE, prism.languages.javascript, 'javascript')
  .split('\n')

const FEATURES = [
  {
    icon: 'shield',
    title: 'Security Analysis',
    desc: 'Detect SQL injection, XSS, CSRF and the OWASP Top 10 before they reach production.',
  },
  {
    icon: 'zap',
    title: 'Performance Tips',
    desc: 'Actionable suggestions to reduce time complexity, memory usage and needless bottlenecks.',
  },
  {
    icon: 'layers',
    title: 'Clean Code Guide',
    desc: 'SOLID principles, naming conventions and the practices senior engineers rely on.',
  },
  {
    icon: 'code',
    title: 'Multi-Language',
    desc: 'JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby and many more.',
  },
  {
    icon: 'bug',
    title: 'Bug Detection',
    desc: 'Spot logic errors, unhandled promises and edge cases that slip past a quick read.',
  },
  {
    icon: 'wrench',
    title: 'Ready-to-use Fixes',
    desc: 'Every issue comes with a refactored snippet you can copy straight into your codebase.',
  },
]

const STEPS = [
  {
    icon: 'clipboard',
    title: 'Paste your code',
    desc: 'Drop any snippet into the editor. Syntax highlighting for every major language.',
  },
  {
    icon: 'cpu',
    title: 'AI analyzes it',
    desc: 'The model inspects bugs, security, performance and clean-code violations in seconds.',
  },
  {
    icon: 'fileCheck',
    title: 'Get detailed feedback',
    desc: 'A structured review with severity, explanations and corrected code examples.',
  },
]

const BENEFITS = [
  { title: 'Ship with confidence', desc: 'Catch issues before review, not after the incident.' },
  { title: 'Learn as you code', desc: 'Every finding explains why — not just what to change.' },
  { title: 'Faster pull requests', desc: 'Arrive at review with the obvious problems already fixed.' },
  { title: 'No setup, no signup', desc: 'Open the workspace and start reviewing immediately.' },
]

const USE_CASES = [
  { icon: 'user', title: 'Solo developers', desc: 'A second pair of senior eyes on side projects and freelance work.' },
  { icon: 'gitPull', title: 'Pre-PR checks', desc: 'Clean up a diff before teammates spend time reviewing it.' },
  { icon: 'book', title: 'Students & learners', desc: 'Understand best practices with explanations, not just fixes.' },
  { icon: 'briefcase', title: 'Interview prep', desc: 'Pressure-test solutions for correctness, edge cases and style.' },
]

const TESTIMONIALS = [
  {
    text:
      'CodeReview AI caught a critical SQL injection vulnerability in my code that I had completely missed. The explanations are clear, the suggestions are actionable, and it even provides corrected code snippets. This tool is now an essential part of my development workflow.',
    initials: 'AK',
    name: 'Alex Kumar',
    role: 'Senior Full-Stack Developer',
  },
  {
    text:
      "As a bootcamp instructor, I recommend this tool to every single one of my students. It gives the kind of detailed, honest feedback a senior developer would give — immediate, educational, and precise. The 'try without signup' feature is perfect for quick classroom demos.",
    initials: 'SP',
    name: 'Sarah Parker',
    role: 'Programming Instructor & Tech Lead',
  },
]

const CONTACTS = [
  { icon: 'mail', label: 'Email', value: 'support@codereviewai.dev' },
  { icon: 'github', label: 'GitHub', value: 'github.com/codereviewai' },
  { icon: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/company/codereviewai' },
  { icon: 'twitter', label: 'Twitter / X', value: '@codereviewai' },
]

function SectionHeader({ tag, title, subtitle, align = 'center' }) {
  return (
    <div className={`section-header section-header-${align}`}>
      <span className="section-tag">{tag}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  )
}

function EditorPreview() {
  return (
    <div className="preview" aria-label="Example AI code review" role="img">
      <div className="preview-chrome">
        <div className="preview-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="preview-tab">
          <Icon name="file" size={13} />
          user.service.js
        </div>
        <div className="preview-chrome-right">
          <span className="preview-pill"><span className="status-dot" /> Review complete</span>
        </div>
      </div>

      <div className="preview-body">
        <div className="preview-code">
          {PREVIEW_LINES.map((line, i) => (
            <div key={i} className={`preview-line ${i === 3 ? 'is-flagged' : ''} ${i === 4 ? 'is-warn' : ''}`}>
              <span className="preview-ln">{i + 1}</span>
              <code dangerouslySetInnerHTML={{ __html: line || ' ' }} />
            </div>
          ))}
          <div className="preview-inline-hint">
            <Icon name="alertCircle" size={13} />
            Line 4 · User input concatenated into SQL query
          </div>
        </div>

        <aside className="preview-review">
          <div className="preview-review-head">
            <span>AI Review</span>
            <span className="preview-count">3 findings</span>
          </div>

          <div className="pv-card sev-critical">
            <div className="pv-card-top">
              <span className="sev-badge">Critical</span>
              <span className="pv-loc">L4</span>
            </div>
            <p className="pv-title">SQL injection risk</p>
            <p className="pv-desc">Use a parameterized query instead of string concatenation.</p>
            <pre className="pv-snippet"><code><span className="token keyword">await</span> db.<span className="token function">execute</span>(<span className="token string">"… WHERE id = $1"</span>, [id])</code></pre>
          </div>

          <div className="pv-card sev-warning">
            <div className="pv-card-top">
              <span className="sev-badge">Warning</span>
              <span className="pv-loc">L5</span>
            </div>
            <p className="pv-title">Unhandled rejection</p>
            <p className="pv-desc">Wrap the query in try/catch and surface a typed error.</p>
          </div>

          <div className="pv-card sev-success">
            <div className="pv-card-top">
              <span className="sev-badge">Good</span>
            </div>
            <p className="pv-title">Clear, single-purpose function</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function AuthModal({ mode, onClose, onSwitch, onContinue }) {
  const dialogRef = useRef(null)
  const isLogin = mode === 'login'

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    dialogRef.current?.querySelector('input')?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, mode])

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        ref={dialogRef}
      >
        <button className="btn btn-ghost btn-icon btn-sm modal-close" onClick={onClose} aria-label="Close dialog">
          <Icon name="close" size={16} />
        </button>

        <div className="modal-header">
          <span className="logo-mark modal-mark" aria-hidden="true">&lt;/&gt;</span>
          <h2 id="auth-title">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p>{isLogin ? 'Sign in to your CodeReview AI account' : 'Join thousands of developers using CodeReview AI'}</p>
        </div>

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <label className="field">
              <span className="field-label">Full name</span>
              <input className="input" type="text" placeholder="John Doe" autoComplete="name" />
            </label>
          )}
          <label className="field">
            <span className="field-label">Email</span>
            <input className="input" type="email" placeholder="you@example.com" autoComplete="email" />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </label>
          <button type="submit" className="btn btn-primary btn-lg btn-block">
            {isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="modal-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => onSwitch(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>

        <div className="modal-divider"><span>or</span></div>

        <button className="btn btn-secondary btn-lg btn-block" onClick={onContinue}>
          Continue without account
          <Icon name="arrowRight" size={15} />
        </button>
      </div>
    </div>
  )
}

function LandingPage({ onTryNow }) {
  const [activeModal, setActiveModal] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const openModal = (mode) => {
    setMobileMenuOpen(false)
    setActiveModal(mode)
  }

  const closeModal = useCallback(() => setActiveModal(null), [])

  const openReviewer = () => {
    setActiveModal(null)
    onTryNow()
  }

  return (
    <div className="landing">

      {/* ── Navbar ── */}
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'is-open' : ''}`}>
        <nav className="nav-container" aria-label="Primary">
          <button className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="CodeReviewAI home">
            <Logo />
          </button>

          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="nav-link">{l.label}</button>
            ))}
          </div>

          <div className="nav-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => openModal('login')}>Log in</button>
            <button className="btn btn-primary btn-sm" onClick={() => openModal('signup')}>Sign up</button>
          </div>

          <button
            className="btn btn-ghost btn-icon nav-toggle"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={18} />
          </button>
        </nav>

        <div id="mobile-menu" className="mobile-menu" hidden={!mobileMenuOpen}>
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="mobile-link">
              {l.label}
              <Icon name="arrowRight" size={14} />
            </button>
          ))}
          <div className="mobile-actions">
            <button className="btn btn-secondary btn-lg" onClick={() => openModal('login')}>Log in</button>
            <button className="btn btn-primary btn-lg" onClick={() => openModal('signup')}>Sign up</button>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-grid" />
            <div className="hero-glow" />
          </div>

          <div className="container hero-inner">
            <div className="hero-badge">
              <span className="status-dot" />
              AI-powered <span className="sep">·</span> Free to use <span className="sep">·</span> Instant results
            </div>

            <h1 className="hero-title">
              Elevate your code quality
              <span className="hero-title-muted"> with an AI reviewer.</span>
            </h1>

            <p className="hero-subtitle">
              Instant, senior-level code reviews. Catch bugs, close security holes and
              improve performance before you ship — no signup required.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={onTryNow}>
                Try it free
                <Icon name="arrowRight" size={16} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => openModal('signup')}>
                Create account
              </button>
            </div>

            <p className="hero-note">
              <Icon name="check" size={14} /> No credit card required
              <span className="sep">·</span>
              <Icon name="check" size={14} /> Works instantly
            </p>

            <div className="hero-visual">
              <EditorPreview />
            </div>
          </div>
        </section>

        {/* ── Language strip ── */}
        <section className="lang-strip" aria-label="Supported languages">
          <div className="container lang-strip-inner">
            <span className="lang-strip-label">Reviews code in</span>
            <ul className="lang-list">
              {LANGUAGES.map((l) => <li key={l}>{l}</li>)}
              <li className="lang-more">+ more</li>
            </ul>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="section" id="features">
          <div className="container">
            <SectionHeader
              tag="Features"
              title="Everything you need in a reviewer"
              subtitle="Powerful analysis built to help every developer write production-quality code."
            />
            <div className="features-grid">
              {FEATURES.map((f) => (
                <article className="feature-card" key={f.title}>
                  <div className="icon-tile"><Icon name={f.icon} size={18} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="section section-alt" id="how-it-works">
          <div className="container">
            <SectionHeader
              tag="How it works"
              title="From snippet to review in three steps"
              subtitle="Better, cleaner and safer code without changing your workflow."
            />
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step" key={s.title}>
                  <div className="step-head">
                    <div className="icon-tile icon-tile-lg"><Icon name={s.icon} size={20} /></div>
                    <span className="step-num">0{i + 1}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Benefits & Use cases ── */}
        <section className="section" id="use-cases">
          <div className="container benefits-layout">
            <div className="benefits-col">
              <SectionHeader
                align="left"
                tag="Why CodeReviewAI"
                title="Built for the way developers actually work"
                subtitle="Fast enough for a quick sanity check, thorough enough to trust before a merge."
              />
              <ul className="benefit-list">
                {BENEFITS.map((b) => (
                  <li key={b.title}>
                    <span className="benefit-check"><Icon name="check" size={13} strokeWidth={2.5} /></span>
                    <div>
                      <strong>{b.title}</strong>
                      <span>{b.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary btn-lg" onClick={onTryNow}>
                Open the workspace
                <Icon name="arrowRight" size={16} />
              </button>
            </div>

            <div className="usecase-grid">
              {USE_CASES.map((u) => (
                <article className="usecase-card" key={u.title}>
                  <div className="icon-tile"><Icon name={u.icon} size={18} /></div>
                  <h3>{u.title}</h3>
                  <p>{u.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="section section-alt" id="reviews">
          <div className="container">
            <SectionHeader
              tag="Testimonials"
              title="Loved by developers"
              subtitle="What developers are saying about CodeReview AI."
            />
            <div className="reviews-grid">
              {TESTIMONIALS.map((t) => (
                <figure className="review-card" key={t.name}>
                  <div className="review-stars" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} filled strokeWidth={0} />)}
                  </div>
                  <blockquote className="review-text">“{t.text}”</blockquote>
                  <figcaption className="review-author">
                    <span className="author-avatar">{t.initials}</span>
                    <span>
                      <span className="author-name">{t.name}</span>
                      <span className="author-role">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-panel">
              <div>
                <h2>Ready to write better code?</h2>
                <p>Paste a snippet and get a structured review in seconds.</p>
              </div>
              <div className="cta-actions">
                <button className="btn btn-primary btn-lg" onClick={onTryNow}>
                  Try without signup
                  <Icon name="arrowRight" size={16} />
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => openModal('signup')}>
                  Create account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="section" id="contact">
          <div className="container">
            <SectionHeader
              tag="Get in touch"
              title="Contact us"
              subtitle="Questions, feedback, or just want to say hi? We'd love to hear from you."
            />
            <div className="contact-grid">
              {CONTACTS.map((c) => (
                <div className="contact-card" key={c.label}>
                  <div className="icon-tile"><Icon name={c.icon} size={17} /></div>
                  <div className="contact-text">
                    <span className="contact-label">{c.label}</span>
                    <span className="contact-value">{c.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <Logo />
            <p>AI-powered code reviews for developers who care about quality, security and performance.</p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Product</h4>
              <button onClick={() => scrollTo('features')}>Features</button>
              <button onClick={() => scrollTo('how-it-works')}>How It Works</button>
              <button onClick={() => scrollTo('use-cases')}>Use Cases</button>
              <button onClick={onTryNow}>Open Workspace</button>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <button onClick={() => scrollTo('reviews')}>Reviews</button>
              <button onClick={() => scrollTo('contact')}>Contact</button>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <button onClick={() => openModal('login')}>Log in</button>
              <button onClick={() => openModal('signup')}>Sign up</button>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 CodeReview AI. Built for developers.</p>
          <button className="footer-top-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
        </div>
      </footer>

      {activeModal && (
        <AuthModal
          mode={activeModal}
          onClose={closeModal}
          onSwitch={setActiveModal}
          onContinue={openReviewer}
        />
      )}
    </div>
  )
}

export default LandingPage
