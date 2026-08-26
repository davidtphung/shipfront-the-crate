import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const prompts = [
  'Which shipments are most likely to miss their delivery window this week?',
  'Show all containers delayed at Long Beach.',
  'Why did spend increase on our Asia-to-US routes?',
  'Draft customer updates for shipments with high-risk ETAs.',
  'Which carriers had the best on-time performance this quarter?',
]

export function Intelligence() {
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState(reduce ? prompts[0] : '')
  const [show, setShow] = useState(!!reduce)

  useEffect(() => {
    if (reduce) return
    const full = prompts[0]
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(full.slice(0, i))
      if (i >= full.length) {
        window.clearInterval(id)
        window.setTimeout(() => setShow(true), 240)
      }
    }, 28)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <section className="bg-[linear-gradient(180deg,#07090D_0%,#0A1020_50%,#07090D_100%)] px-6 py-24">
      <div className="mx-auto max-w-[1440px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-violet">The Crate intelligence layer</p>
        <h2 className="mt-4 max-w-[16ch] text-[42px] leading-[1.05] tracking-[-0.03em] lg:text-[56px]">
          Ask your operation what matters.
        </h2>
        <p className="mt-5 max-w-[40em] text-lg text-mist">
          Use natural language to understand what changed, which shipments need attention, and where your network is exposed.
        </p>

        <div className="mt-12 rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(17,23,34,0.86)] p-6">
          <p className="font-mono text-[11px] text-dim">Product preview · grounded in sample workspace data</p>
          <p className="mt-4 min-h-12 font-mono text-[15px] text-cyan">
            {typed}
            {!reduce && typed.length < prompts[0].length ? <span className="animate-pulse">|</span> : null}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {prompts.slice(1).map((prompt) => (
              <li key={prompt} className="rounded-[10px] border border-[var(--border-subtle)] px-3 py-2 text-[13px] text-mist">
                {prompt}
              </li>
            ))}
          </ul>
          <AnimatePresence>
            {show ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <div>
                  <p className="text-ink">
                    Four Asia-to-US boxes sit inside a 36-hour miss window. The common factor is dwell at Long Beach, not the ocean leg.
                  </p>
                  <ul className="mt-4 space-y-2 font-mono text-[13px] text-mist">
                    <li>SF-2408-1187 · Long Beach → Chicago · Watch</li>
                    <li>SF-2408-1210 · Long Beach → Dallas · Watch</li>
                    <li>SF-2408-1216 · Long Beach → Atlanta · Critical</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  {['Create task', 'Send alert', 'Draft customer note', 'Open report'].map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="min-h-11 rounded-[12px] border border-[var(--border-subtle)] px-3 text-left text-[14px] text-ink hover:border-[var(--border-active)]"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
