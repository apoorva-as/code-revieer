import './Logo.css'

function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo-${size}`}>
      <span className="logo-mark" aria-hidden="true">&lt;/&gt;</span>
      <span className="logo-word">
        CodeReview<span className="logo-ai">AI</span>
      </span>
    </span>
  )
}

export default Logo
