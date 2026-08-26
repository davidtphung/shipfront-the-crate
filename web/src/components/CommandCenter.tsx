import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const nodes = [
  { id: 'lax', name: 'Los Angeles', x: 118, y: 168 },
  { id: 'lgb', name: 'Long Beach', x: 132, y: 188 },
  { id: 'sha', name: 'Shanghai', x: 548, y: 150 },
  { id: 'sin', name: 'Singapore', x: 520, y: 228 },
  { id: 'rtm', name: 'Rotterdam', x: 368, y: 92 },
  { id: 'chi', name: 'Chicago', x: 198, y: 128 },
  { id: 'nyc', name: 'New York', x: 248, y: 118 },
]

const routes = [
  { d: 'M132 188 C 240 210, 400 190, 548 150', delay: 0.8 },
  { d: 'M548 150 C 500 80, 420 70, 368 92', delay: 1.1 },
  { d: 'M132 188 C 160 150, 180 140, 198 128', delay: 1.35 },
  { d: 'M198 128 C 220 110, 236 112, 248 118', delay: 1.55 },
  { d: 'M520 228 C 480 200, 430 120, 368 92', delay: 1.7 },
]

const events = [
  'Container gated out — Long Beach',
  'Customs documents verified',
  'Rail departure confirmed',
]

export function CommandCenter() {
  const reduce = useReducedMotion()
  const [feed, setFeed] = useState(events.slice(0, 1))
  const [hover, setHover] = useState<string | null>('lgb')

  useEffect(() => {
    if (reduce) {
      setFeed(events)
      return
    }
    const timers = events.map((_, i) =>
      window.setTimeout(() => setFeed(events.slice(0, i + 1)), 2200 + i * 900),
    )
    return () => timers.forEach(clearTimeout)
  }, [reduce])

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(21,29,43,0.96),rgba(12,16,23,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <p className="absolute left-4 top-4 z-10 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
        Product preview
      </p>
      <svg viewBox="0 0 640 360" className="block h-auto w-full" role="img" aria-label="Sample workspace map with freight routes">
        <defs>
          <linearGradient id="arc" x1="0" x2="1">
            <stop offset="0%" stopColor="#53D9FF" />
            <stop offset="100%" stopColor="#5B7CFF" />
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="#0B1018" />
        <g opacity="0.22" stroke="rgba(184,202,225,0.35)" strokeWidth="0.6" fill="none">
          <path d="M40 80 C 120 60, 220 70, 300 90 S 480 70, 600 100" />
          <path d="M30 160 C 140 140, 260 180, 400 150 S 560 170, 620 140" />
          <path d="M50 240 C 180 220, 280 260, 430 230 S 540 250, 610 220" />
          <path d="M80 40 V 320 M200 30 V 330 M320 20 V 340 M440 30 V 330 M560 40 V 320" />
        </g>
        {routes.map((route) => (
          <motion.path
            key={route.d}
            d={route.d}
            fill="none"
            stroke="url(#arc)"
            strokeWidth="1.4"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: reduce ? 0 : 1.4, delay: reduce ? 0 : route.delay, ease: [0.22, 1, 0.36, 1] as const }}
          />
        ))}
        {nodes.map((node, i) => (
          <g key={node.id} onMouseEnter={() => setHover(node.id)} onFocus={() => setHover(node.id)}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="4.5"
              fill="#53D9FF"
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : 1.4 + i * 0.12 }}
            />
            {!reduce ? (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="10"
                fill="none"
                stroke="#53D9FF"
                strokeWidth="0.8"
                animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.35, 1] }}
                transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ) : null}
            <text x={node.x + 8} y={node.y - 8} fill="#AAB4C3" fontSize="10" fontFamily="JetBrains Mono, monospace">
              {node.name}
            </text>
          </g>
        ))}
      </svg>

      <motion.article
        className="absolute left-4 top-16 w-[min(280px,70%)] rounded-[16px] border border-[var(--border-active)] bg-[rgba(17,23,34,0.92)] p-4 backdrop-blur-sm"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: reduce ? 0 : 2.1, type: 'spring', stiffness: 180, damping: 22 }}
      >
        <p className="font-mono text-[11px] text-cyan">SF-2408-1187</p>
        <h3 className="mt-1 text-lg text-ink">Long Beach → Chicago</h3>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[12px] text-mist">
          <div><dt className="text-dim">Mode</dt><dd>Intermodal</dd></div>
          <div><dt className="text-dim">Status</dt><dd className="text-green">In transit</dd></div>
          <div><dt className="text-dim">ETA</dt><dd>Aug 28, 09:40</dd></div>
          <div><dt className="text-dim">Risk</dt><dd>Low</dd></div>
        </dl>
        <ol className="mt-4 flex gap-1" aria-label="Route timeline">
          {['Origin pickup', 'Port departure', 'Rail transfer', 'Final delivery'].map((step, i) => (
              <li key={step} className={`h-1.5 flex-1 rounded-full ${i < 2 ? 'bg-cyan' : 'bg-[rgba(184,202,225,0.16)]'}`}>
              <span className="sr-only">{step}{i < 2 ? ', complete' : ''}</span>
            </li>
          ))}
        </ol>
      </motion.article>

      <div className="absolute bottom-4 right-4 w-[min(260px,72%)] rounded-[16px] border border-[var(--border-subtle)] bg-[rgba(17,23,34,0.9)] p-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Live events</p>
        <ul className="mt-2 space-y-2">
          {feed.map((item) => (
            <li key={item} className="font-mono text-[12px] text-mist">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {hover ? (
        <p className="pointer-events-none absolute bottom-4 left-4 rounded-[10px] border border-[var(--border-subtle)] bg-elevated px-3 py-2 font-mono text-[12px] text-ink">
          {nodes.find((n) => n.id === hover)?.name}
        </p>
      ) : null}
    </div>
  )
}
