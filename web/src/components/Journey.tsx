import { motion, useReducedMotion } from 'framer-motion'

const steps = [
  { n: '01', title: 'Plan', copy: 'Compare routes, capacity, cost, and confidence.' },
  { n: '02', title: 'Book', copy: 'Commit with carrier and document requirements in view.' },
  { n: '03', title: 'Track', copy: 'Follow milestones, location signals, and ETA changes.' },
  { n: '04', title: 'Resolve', copy: 'Turn exceptions into owned, time-bound actions.' },
  { n: '05', title: 'Learn', copy: 'Use network performance to make the next move better.' },
]

export function Journey() {
  const reduce = useReducedMotion()
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="max-w-[18ch] text-[42px] leading-[1.05] tracking-[-0.03em] lg:text-[56px]">
          From booking to delivery, one operational thread.
        </h2>
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-[rgba(184,202,225,0.16)] md:block" />
          <motion.div
            className="absolute top-4 hidden h-4 w-4 rounded-[4px] border border-cyan bg-bg md:block"
            initial={reduce ? { left: '90%' } : { left: '0%' }}
            whileInView={{ left: '90%' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 2.4, ease: [0.16, 1, 0.3, 1] as const }}
            aria-hidden="true"
          />
          <ol className="grid gap-6 md:grid-cols-5">
            {steps.map((step) => (
              <li key={step.n} className="rounded-[20px] border border-[var(--border-subtle)] bg-surface p-5">
                <p className="font-mono text-[12px] text-cyan">{step.n}</p>
                <h3 className="mt-3 text-2xl">{step.title}</h3>
                <p className="mt-3 text-mist">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
