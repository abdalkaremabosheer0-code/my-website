import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const home = pathname === '/'

  return (
    <nav className="nav">
      <Link className="logo" to="/">sayit.</Link>
      <ul>
        {home ? (
          <>
            <li><Link to="/#start">What you get</Link></li>
            <li><Link to="/#how">How it works</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shadowing">Shadowing</Link></li>
            <li><Link to="/vocabulary">Vocabulary</Link></li>
          </>
        )}
      </ul>
      {home ? <Link className="cta" to="/app">Start</Link> : <span />}
    </nav>
  )
}
