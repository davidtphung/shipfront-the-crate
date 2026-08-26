const partners = ['Forwarders', 'Retailers', 'Industrial suppliers', 'Manufacturers', '3PLs', 'Marketplaces']

const chips = [
  '42 countries connected',
  '98.7% shipment data completeness',
  'Minutes, not hours, to resolve exceptions',
  'One workspace across every carrier',
]

export function Trust() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-bg-2 px-6 py-14">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-center text-mist">Built for teams moving complex freight.</p>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
          Partner types, not customer logos. Product preview.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((name) => (
            <li
              key={name}
              className="flex min-h-16 items-center justify-center rounded-[14px] border border-[var(--border-subtle)] bg-surface font-mono text-[12px] uppercase tracking-[0.12em] text-mist"
            >
              {name}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-[10px] border border-[var(--border-subtle)] px-3 py-2 font-mono text-[12px] text-mist"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
