import { Link } from 'react-router-dom'
import { CrateMark } from '../lib/mark'

const cols = [
  {
    title: 'Product',
    links: [
      { to: '/product', label: 'Command Center' },
      { to: '/product#booking', label: 'Booking' },
      { to: '/product#tracking', label: 'Tracking' },
      { to: '/product#intelligence', label: 'Intelligence' },
      { to: '/product#analytics', label: 'Analytics' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { to: '/network', label: 'Freight Forwarders' },
      { to: '/network', label: 'Retailers' },
      { to: '/network', label: 'Manufacturers' },
      { to: '/network', label: '3PLs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/resources', label: 'About' },
      { to: '/resources', label: 'Careers' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/developers', label: 'API' },
      { to: '/developers', label: 'Documentation' },
      { to: '/resources', label: 'Security' },
      { to: '/resources', label: 'Status' },
    ],
  },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-[var(--border-subtle)] bg-bg-2">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan">
            <CrateMark size={22} />
            <span className="text-[13px] tracking-[0.16em] text-ink">SHIPFRONT</span>
          </div>
          <p className="mt-5 max-w-sm text-mist">Shipfront. Operations for everything in motion.</p>
          <div className="mt-8 rounded-[20px] border border-[var(--border-subtle)] bg-surface p-6">
            <p className="text-2xl text-ink">Move with more certainty.</p>
            <Link
              to="/access"
              className="mt-5 inline-flex min-h-11 items-center rounded-[12px] bg-blue px-4 text-[13px] font-medium text-[#07090D]"
            >
              Request access
            </Link>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{col.title}</p>
              {col.links.map((link) => (
                <Link key={link.label} to={link.to} className="flex min-h-11 items-center text-[15px] text-mist hover:text-ink">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 pb-10 text-[13px] text-dim">
        <p>© 2026 Shipfront</p>
        <div className="flex flex-wrap gap-5">
          <Link to="/resources" className="min-h-11 inline-flex items-center">Privacy</Link>
          <Link to="/resources" className="min-h-11 inline-flex items-center">Terms</Link>
          <Link to="/resources" className="min-h-11 inline-flex items-center">Security</Link>
        </div>
      </div>
    </footer>
  )
}
