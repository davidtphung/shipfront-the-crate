import { useState, type FormEvent } from 'react'

export function Access() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="mx-auto max-w-[640px] px-6 pb-24 pt-32">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-cyan">Access</p>
      <h1 className="mt-4 text-[48px] leading-[1.02] tracking-[-0.04em]">Request access</h1>
      <p className="mt-4 text-mist" id="access-hint">
        Name, email, and company. This preview does not send.
      </p>
      <form className="mt-10 space-y-5" onSubmit={onSubmit} aria-describedby="access-hint">
        <label className="block">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Name</span>
          <input required name="name" autoComplete="name" className="min-h-13 w-full rounded-[12px] border border-[var(--border-subtle)] bg-surface px-4 text-ink" />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Email</span>
          <input required type="email" name="email" autoComplete="email" className="min-h-13 w-full rounded-[12px] border border-[var(--border-subtle)] bg-surface px-4 text-ink" />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Company</span>
          <input required name="company" autoComplete="organization" className="min-h-13 w-full rounded-[12px] border border-[var(--border-subtle)] bg-surface px-4 text-ink" />
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center rounded-[12px] bg-blue px-5 text-[14px] font-medium text-[#07090D]">
          Submit request
        </button>
      </form>
      {sent ? (
        <div className="mt-8 rounded-[16px] border border-[var(--border-active)] bg-surface p-5" role="status" tabIndex={-1}>
          <p className="text-ink">This preview does not send.</p>
          <p className="mt-2 text-mist">
            For access requests, email <a className="underline" href="mailto:info@myshipfront.com">info@myshipfront.com</a>.
          </p>
        </div>
      ) : null}
    </section>
  )
}
