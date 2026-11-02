import { lazy, Suspense, useState } from 'react'
import LandingPage from './LandingPage'

// The workspace pulls in the editor + highlighters, so load it only when opened.
const CodeReviewer = lazy(() => import('./CodeReviewer'))

function PageLoader() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
      <span className="spinner" role="status" aria-label="Loading workspace" />
    </div>
  )
}

function App() {
  const [page, setPage] = useState('landing')

  if (page === 'reviewer') {
    return (
      <Suspense fallback={<PageLoader />}>
        <CodeReviewer onBack={() => setPage('landing')} />
      </Suspense>
    )
  }

  return <LandingPage onTryNow={() => setPage('reviewer')} />
}

export default App
