import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CrateMark } from '../lib/mark'

const links = [
  { to: '/product', label: 'Product' },
  { to: '/#why', label: 'Why Shipfront' },
  { to: '/network', label: 'Network' },
  { to: '/developers', label: 'Developers' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/resources', label: 'Resources' },
]

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 rounded-[14px] px-4 py-2 transition-[background,border-color,box-shadow,backdrop-filter] duration-300 ${
          solid
            ? 'border border-[var(--border-subtle)] bg-[rgba(7,9,13,0.82)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <Link to="/" className="inline-flex min-h-11 items-center gap-2.5 text-ink" aria-label="Shipfront home">
          <CrateMark size={20} className="text-cyan" />
          <span className="text-[13px] tracking-[0.16em]">SHIPFRONT</span>
        </Link>

        <ul className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className="inline-flex min-h-11 items-center text-[13px] text-mist transition-colors hover:text-ink"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/signin" className="inline-flex min-h-11 items-center text-[13px] text-mist hover:text-ink">
            Sign in
          </Link>
          <Link
            to="/access"
            className="inline-flex min-h-11 items-center rounded-[12px] bg-blue px-4 text-[13px] font-medium text-[#07090D] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_0_0_1px_rgba(111,147,255,0.5),0_8px_24px_rgba(91,124,255,0.25)]"
          >
            Request access
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[12px] border border-[var(--border-subtle)] text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
        </button>
      </nav>

      {open ? (
        <div id="mobile-nav" className="mx-auto mt-2 max-w-[1440px] rounded-[16px] border border-[var(--border-subtle)] bg-[rgba(7,9,13,0.94)] p-4 backdrop-blur-xl lg:hidden">
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="flex min-h-11 items-center text-mist">
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/signin" className="flex min-h-11 items-center text-mist">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/access" className="flex min-h-11 items-center text-blue">
                Request access
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
