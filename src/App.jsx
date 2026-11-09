import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Vocabulary from './pages/Vocabulary.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* مؤقتاً: /app يعرض المفردات إلى أن نبني الداشبورد */}
        <Route path="/app" element={<Vocabulary />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
      </Routes>
    </BrowserRouter>
  )
}