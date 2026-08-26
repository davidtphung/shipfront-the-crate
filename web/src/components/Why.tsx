import { motion, useReducedMotion } from 'framer-motion'

const cards = [
  {
    title: 'Too many systems',
    copy: 'Carrier portals, spreadsheets, document folders, and inboxes create a fragmented view of the same shipment.',
    visual: 'windows',
  },
  {
    title: 'Exceptions arrive late',
    copy: 'By the time a delay reaches your team, the customer promise may already be broken.',
    visual: 'delay',
  },
  {
    title: 'Visibility is not control',
    copy: 'A tracking page tells you where something is. An operating system tells you what to do next.',
    visual: 'actions',
  },
]

function MiniVisual({ kind }: { kind: string }) {
  const reduce = useReducedMotion()
  if (kind === 'windows') {
    return (
      <div className="relative h-36 overflow-hidden rounded-[14px] bg-bg-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-16 w-24 rounded-[10px] border border-[var(--border-subtle)] bg-elevated"
            initial={reduce ? false : { x: 16 + i * 28, y: 18 + i * 12, opacity: 0.5 }}
            whileInView={{ x: 86, y: 36, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const }}
          />
        ))}
      </div>
    )
  }
  if (kind === 'delay') {
    return (
      <div className="flex h-36 items-center gap-2 rounded-[14px] bg-bg-2 px-4">
        <span className="h-1 flex-1 rounded-full bg-[rgba(184,202,225,0.16)]" />
        <motion.span
          className="h-8 w-8 rounded-full"
          initial={reduce ? { backgroundColor: '#43E7A8' } : { backgroundColor: '#FFB454' }}
          whileInView={{ backgroundColor: '#43E7A8' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <span className="h-1 flex-1 rounded-full bg-[rgba(184,202,225,0.16)]" />
      </div>
    )
  }
  return (
    <div className="grid h-36 grid-cols-2 gap-2 rounded-[14px] bg-bg-2 p-3">
      {['Notify customer', 'Rebook', 'Upload document', 'Assign owner'].map((action) => (
        <span key={action} className="flex items-center rounded-[10px] border border-[var(--border-subtle)] px-2 font-mono text-[11px] text-mist">
          {action}
        </span>
      ))}
    </div>
  )
}

export function Why() {
  const reduce = useReducedMotion()
  return (
    <section id="why" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="max-w-[16ch] text-[42px] leading-[1.05] tracking-[-0.03em] lg:text-[56px]">
          Shipping should not require detective work.
        </h2>
        <p className="mt-5 max-w-[40em] text-lg text-mist">
          Operations teams still chase updates across portals, inboxes, spreadsheets, PDFs, carrier sites, and calls. The Crate pulls the signal into one continuously updated operational view.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              className="rounded-[20px] border border-[var(--border-subtle)] bg-surface p-5 transition-[transform,border-color] duration-300 hover:-translate-y-2 hover:border-[var(--border-active)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <MiniVisual kind={card.visual} />
              <h3 className="mt-5 text-2xl">{card.title}</h3>
              <p className="mt-3 text-[16px] text-mist">{card.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
