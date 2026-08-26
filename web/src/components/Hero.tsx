import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CommandCenter } from './CommandCenter'

export function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-28 lg:pb-24 lg:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_50%_at_70%_20%,rgba(91,124,255,0.18),transparent_60%)]" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div>
          <motion.p className="font-mono text-[12px] uppercase tracking-[0.2em] text-cyan" {...rise(0.15)}>
            The Crate / Freight operating system
          </motion.p>
          <h1 className="mt-5 max-w-[16ch] text-[46px] font-medium leading-[0.95] tracking-[-0.04em] sm:text-[64px] lg:text-[88px]">
            <motion.span className="block overflow-hidden" {...rise(0.28)}>
              Know where every
            </motion.span>
            <motion.span className="block overflow-hidden" {...rise(0.4)}>
              shipment stands.
            </motion.span>
          </h1>
          <motion.p className="mt-6 max-w-[36em] text-lg text-mist" {...rise(0.55)}>
            Shipfront brings bookings, carriers, documents, exceptions, and live tracking into one operational workspace so your team can move goods with confidence.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" {...rise(0.7)}>
            <Link
              to="/access"
              className="inline-flex min-h-11 items-center rounded-[12px] bg-blue px-5 text-[14px] font-medium text-[#07090D] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(91,124,255,0.28)]"
            >
              Request access
            </Link>
            <a
              href="#product"
              className="inline-flex min-h-11 items-center rounded-[12px] border border-[var(--border-subtle)] px-5 text-[14px] text-ink hover:border-[var(--border-active)]"
            >
              Explore the platform
            </a>
          </motion.div>
        </div>
        <CommandCenter />
      </div>
    </section>
  )
}
