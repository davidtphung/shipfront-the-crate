import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Access } from './pages/Access'
import { Home } from './pages/Home'
import { Contact, Developers, Network, Pricing, Product, Resources, SignIn } from './pages/Inner'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ block: 'start' })
      return
    }
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/access" element={<Access />} />
          <Route path="/quote" element={<Access />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/product" element={<Product />} />
          <Route path="/network" element={<Network />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
