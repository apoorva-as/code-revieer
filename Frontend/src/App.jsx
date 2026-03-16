import { useState } from 'react'
import LandingPage from './LandingPage'
import CodeReviewer from './CodeReviewer'

function App() {
  const [page, setPage] = useState('landing')

  if (page === 'reviewer') {
    return <CodeReviewer onBack={() => setPage('landing')} />
  }

  return <LandingPage onTryNow={() => setPage('reviewer')} />
}

export default App