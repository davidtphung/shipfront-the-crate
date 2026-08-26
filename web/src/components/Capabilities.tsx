import { motion, useReducedMotion } from 'framer-motion'

const blocks = [
  {
    id: 'command',
    title: 'Every shipment, in one operational view.',
    copy: 'Bring route details, carrier milestones, ETAs, documents, owners, costs, messages, and exceptions together in a single timeline.',
    panel: 'command',
  },
  {
    id: 'booking',
    title: 'Choose the route that fits the promise.',
    copy: 'Compare carriers, transit times, cutoffs, pricing, and risk before you commit.',
    panel: 'booking',
  },
  {
    id: 'exceptions',
    title: 'See risk before it becomes a fire drill.',
    copy: 'Shipfront turns events into prioritized work, so your team can act while there is still time to protect the delivery.',
    panel: 'risk',
  },
  {
    id: 'documents',
    title: 'Documents that travel with the shipment.',
    copy: 'Keep bills of lading, packing lists, customs records, proofs of delivery, and internal notes connected to the freight they belong to.',
    panel: 'docs',
  },
  {
    id: 'analytics',
    title: 'Turn movement into operational intelligence.',
    copy: 'See carrier reliability, dwell time, late-delivery patterns, route performance, and cost drift across your network.',
    panel: 'charts',
  },
]

function Panel({ kind }: { kind: string }) {
  if (kind === 'command') {
    return (
      <div className="grid gap-3 md:grid-cols-[0.7fr_1.3fr]">
        <ul className="space-y-2">
          {['SF-2408-1187', 'SF-2408-1194', 'SF-2408-1201'].map((id, i) => (
            <li key={id} className={`rounded-[12px] border px-3 py-3 font-mono text-[12px] ${i === 0 ? 'border-[var(--border-active)] bg-elevated text-ink' : 'border-[var(--border-subtle)] text-mist'}`}>
              {id}
            </li>
          ))}
        </ul>
        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-elevated p-4">
          <p className="font-mono text-[12px] text-cyan">SF-2408-1187 · Intermodal</p>
          <p className="mt-2 text-ink">Long Beach → Chicago · In transit</p>
          <p className="mt-3 text-[14px] text-mist">Operator assigned. Documents on file. ETA Aug 28, 09:40. AI note: dwell at rail is inside the planned window.</p>
        </div>
      </div>
    )
  }
  if (kind === 'booking') {
    const rows = [
      ['Harborline', '$2,140', '5d', '96', 'Recommended'],
      ['Pacific Arc', '$1,980', '7d', '91', ''],
      ['Northstack', '$2,310', '4d', '88', ''],
    ]
    return (
      <div className="overflow-hidden rounded-[16px] border border-[var(--border-subtle)]">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-bg-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
            <tr>
              <th className="px-3 py-3">Carrier</th>
              <th>Price</th>
              <th>Transit</th>
              <th>Reliability</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className={row[4] ? 'bg-[rgba(91,124,255,0.08)] text-ink' : 'text-mist'}>
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (kind === 'risk') {
    return (
      <div className="rounded-[16px] border border-[rgba(255,180,84,0.35)] bg-elevated p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-warning">Watch</p>
        <h4 className="mt-2 text-xl">Port congestion may delay arrival by 18 hours</h4>
        <p className="mt-3 text-mist">Suggested: notify consignee, reserve alternate linehaul, hold the outbound appointment.</p>
        <p className="mt-4 font-mono text-[12px] text-dim">Owner unassigned · SLA 4h</p>
      </div>
    )
  }
  if (kind === 'docs') {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {['Bill of lading', 'Packing list', 'Customs record'].map((doc) => (
          <div key={doc} className="rounded-[14px] border border-[var(--border-subtle)] bg-elevated p-4">
            <p className="font-mono text-[11px] text-green">Verified</p>
            <p className="mt-2 text-ink">{doc}</p>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {[
        ['On-time', '94.2%'],
        ['Avg dwell', '18h'],
        ['Exceptions', '12'],
        ['Cost variance', '+2.1%'],
      ].map(([k, v]) => (
        <div key={k} className="rounded-[14px] border border-[var(--border-subtle)] bg-elevated p-4">
          <p className="font-mono text-[11px] text-dim">{k}</p>
          <p className="mt-2 text-2xl text-ink">{v}</p>
        </div>
      ))}
    </div>
  )
}

export function Capabilities() {
  const reduce = useReducedMotion()
  return (
    <section id="product" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-[1440px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-cyan">One control surface</p>
        <h2 className="mt-4 max-w-[18ch] text-[42px] leading-[1.05] tracking-[-0.03em] lg:text-[56px]">
          Everything your shipment needs. Nothing your team has to chase.
        </h2>
        <div className="mt-16 space-y-20">
          {blocks.map((block, i) => (
            <motion.article
              key={block.id}
              id={block.id}
              className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <div>
                <h3 className="text-[32px] leading-[1.15] tracking-[-0.03em]">{block.title}</h3>
                <p className="mt-4 max-w-[36em] text-mist">{block.copy}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-surface p-5">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Product preview</p>
                <Panel kind={block.panel} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
