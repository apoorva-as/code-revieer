import { useState } from 'react'
import './LandingPage.css'

function LandingPage({ onTryNow }) {
  const [activeModal, setActiveModal] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const openReviewer = () => {
    setActiveModal(null)
    onTryNow()
  }

  return (
    <div className="landing">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">&lt;/&gt;</span>
            <span className="logo-text">CodeReview<span className="logo-ai">AI</span></span>
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollTo('features')} className="nav-link">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="nav-link">How It Works</button>
            <button onClick={() => scrollTo('reviews')} className="nav-link">Reviews</button>
            <button onClick={() => scrollTo('contact')} className="nav-link">Contact</button>
          </div>

          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => setActiveModal('login')}>Login</button>
            <button className="btn-primary" onClick={() => setActiveModal('signup')}>Sign Up</button>
          </div>

          <button
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-grid" />
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              AI-Powered &middot; Free to Use &middot; Instant Results
            </div>

            <h1 className="hero-title">
              Elevate Your<br />
              <span className="gradient-text">Code Quality</span><br />
              with AI
            </h1>

            <p className="hero-subtitle">
              Get instant, intelligent code reviews powered by advanced AI.
              Catch bugs, improve performance, and write better code —
              no signup required.
            </p>

            <div className="hero-actions">
              <button className="btn-cta" onClick={onTryNow}>
                <span>Try It Free</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn-secondary-cta" onClick={() => setActiveModal('signup')}>
                Create Account
              </button>
            </div>

            <p className="hero-note">No credit card required &middot; Works instantly</p>
          </div>

          <div className="hero-visual">
            <div className="code-preview-card">
              <div className="code-card-header">
                <div className="code-card-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="code-card-title">main.js</span>
              </div>
              <pre className="code-preview-body"><code>{`function fetchUser(id) {
  const user = db.query(
    "SELECT * FROM users" +
    " WHERE id = " + id
  )
  return user
}`}</code></pre>
              <div className="ai-review-bubble">
                <div className="bubble-icon">⚠️</div>
                <div className="bubble-text">
                  <strong>SQL Injection Risk</strong>
                  <p>Use parameterized queries instead of string concatenation to prevent injection attacks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">How CodeReview AI Works</h2>
            <p className="section-subtitle">Three simple steps to better, cleaner, and safer code</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                </svg>
              </div>
              <h3>Paste Your Code</h3>
              <p>Drop any code snippet into the editor — JavaScript, Python, Java, C++, Go, and more. Full syntax highlighting included.</p>
            </div>

            <div className="step-card featured">
              <div className="step-number">02</div>
              <div className="step-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.36 5.64l1.41-1.41" />
                </svg>
              </div>
              <h3>AI Analyzes It</h3>
              <p>Our advanced AI deeply analyzes your code for bugs, security vulnerabilities, performance issues, and clean code violations.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Get Detailed Feedback</h3>
              <p>Receive a comprehensive review with specific suggestions, corrected code examples, and best practices to apply right away.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">Powerful analysis tools built to help every developer write production-quality code</p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: '🔐',
                title: 'Security Analysis',
                desc: 'Detect SQL injections, XSS, CSRF, and all common OWASP Top 10 vulnerabilities before they reach production.',
              },
              {
                icon: '⚡',
                title: 'Performance Tips',
                desc: 'Get actionable suggestions to reduce time complexity, memory usage, and remove unnecessary bottlenecks.',
              },
              {
                icon: '🧹',
                title: 'Clean Code Guide',
                desc: 'Follow SOLID principles, naming conventions, and industry best practices recommended by top engineers.',
              },
              {
                icon: '🌐',
                title: 'Multi-Language',
                desc: 'Supports JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, and many more languages.',
              },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="cta-strip">
            <p>Ready to write better code?</p>
            <button className="btn-cta" onClick={onTryNow}>
              <span>Try Without Signup</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="reviews" id="reviews">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">Loved by Developers</h2>
            <p className="section-subtitle">See what real developers are saying about CodeReview AI</p>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "CodeReview AI caught a critical SQL injection vulnerability in my code that I had completely missed.
                The explanations are clear, the suggestions are actionable, and it even provides corrected code snippets.
                This tool is now an essential part of my development workflow."
              </p>
              <div className="review-author">
                <div className="author-avatar">AK</div>
                <div>
                  <div className="author-name">Alex Kumar</div>
                  <div className="author-role">Senior Full-Stack Developer</div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "As a bootcamp instructor, I recommend this tool to every single one of my students.
                It gives the kind of detailed, honest feedback a senior developer would give — immediate, educational, and precise.
                The 'try without signup' feature is perfect for quick classroom demos."
              </p>
              <div className="review-author">
                <div className="author-avatar">SP</div>
                <div>
                  <div className="author-name">Sarah Parker</div>
                  <div className="author-role">Programming Instructor &amp; Tech Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="contact" id="contact">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">Have questions, feedback, or just want to say hi? We'd love to hear from you.</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">support@codereviewai.dev</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">GitHub</div>
                  <div className="contact-value">github.com/codereviewai</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">LinkedIn</div>
                  <div className="contact-value">linkedin.com/company/codereviewai</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Twitter / X</div>
                  <div className="contact-value">@codereviewai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span className="logo-icon">&lt;/&gt;</span>
            <span className="logo-text">CodeReview<span className="logo-ai">AI</span></span>
          </div>
          <p>© 2026 CodeReview AI. Built with ❤️ for developers.</p>
          <div className="footer-links">
            <button onClick={() => scrollTo('how-it-works')}>How It Works</button>
            <button onClick={() => scrollTo('reviews')}>Reviews</button>
            <button onClick={() => scrollTo('contact')}>Contact</button>
          </div>
        </div>
      </footer>

      {/* ── Auth Modals ── */}
      {activeModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div className="modal">
            <button className="modal-close" onClick={() => setActiveModal(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {activeModal === 'login' ? (
              <>
                <div className="modal-header">
                  <div className="modal-logo">&lt;/&gt;</div>
                  <h2>Welcome Back</h2>
                  <p>Sign in to your CodeReview AI account</p>
                </div>
                <form className="modal-form" onSubmit={e => e.preventDefault()}>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="you@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <button type="submit" className="btn-form-primary">Sign In</button>
                </form>
                <p className="modal-switch">
                  Don't have an account?{' '}
                  <button onClick={() => setActiveModal('signup')}>Sign Up</button>
                </p>
                <div className="modal-divider"><span>or</span></div>
                <button className="btn-form-secondary" onClick={openReviewer}>
                  Continue without account →
                </button>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-logo">&lt;/&gt;</div>
                  <h2>Create Account</h2>
                  <p>Join thousands of developers using CodeReview AI</p>
                </div>
                <form className="modal-form" onSubmit={e => e.preventDefault()}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="you@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <button type="submit" className="btn-form-primary">Create Account</button>
                </form>
                <p className="modal-switch">
                  Already have an account?{' '}
                  <button onClick={() => setActiveModal('login')}>Login</button>
                </p>
                <div className="modal-divider"><span>or</span></div>
                <button className="btn-form-secondary" onClick={openReviewer}>
                  Continue without account →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
