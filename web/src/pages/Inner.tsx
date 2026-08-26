import { Link } from 'react-router-dom'

export function SignIn() {
  return (
    <section className="mx-auto max-w-[480px] px-6 pb-24 pt-32">
      <h1 className="text-[48px] leading-[1.02] tracking-[-0.04em]">Sign in</h1>
      <p className="mt-4 text-mist">This preview does not authenticate. Request access to get a workspace.</p>
      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input aria-label="Email" placeholder="Email" className="min-h-13 w-full rounded-[12px] border border-[var(--border-subtle)] bg-surface px-4" />
        <input aria-label="Password" type="password" placeholder="Password" className="min-h-13 w-full rounded-[12px] border border-[var(--border-subtle)] bg-surface px-4" />
        <button type="submit" className="inline-flex min-h-11 items-center rounded-[12px] bg-blue px-5 text-[#07090D]">
          Continue
        </button>
      </form>
    </section>
  )
}

export function Product() {
  return (
    <section className="mx-auto max-w-[960px] px-6 pb-24 pt-32">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-cyan">Product</p>
      <h1 className="mt-4 text-[56px] leading-[1.02] tracking-[-0.04em]">The Crate is the control surface.</h1>
      <p className="mt-5 max-w-[40em] text-lg text-mist">
        One workspace for bookings, tracking, documents, exceptions, and network performance. The home page walks the full product story.
      </p>
      <Link to="/#product" className="mt-8 inline-flex min-h-11 items-center text-cyan">
        See the platform
      </Link>
    </section>
  )
}

export function Network() {
  return (
    <section className="mx-auto max-w-[960px] px-6 pb-24 pt-32">
      <h1 className="text-[56px] leading-[1.02] tracking-[-0.04em]">A network view, not a carrier portal.</h1>
      <p className="mt-5 max-w-[40em] text-lg text-mist">
        Forwarders, retailers, manufacturers, and 3PLs share the same operational objects: the shipment, the exception, the document, the promise.
      </p>
    </section>
  )
}

export function Developers() {
  return (
    <section className="mx-auto max-w-[960px] px-6 pb-24 pt-32">
      <h1 className="text-[56px] leading-[1.02] tracking-[-0.04em]">An API for freight events.</h1>
      <pre className="mt-8 overflow-auto rounded-[16px] border border-[var(--border-subtle)] bg-surface p-5 font-mono text-[13px] text-mist">
{`GET /v1/shipments/SF-2408-1187
{
  "route": ["LGB", "CHI"],
  "status": "in_transit",
  "risk": "low"
}`}
      </pre>
    </section>
  )
}

export function Pricing() {
  return (
    <section className="mx-auto max-w-[720px] px-6 pb-24 pt-32">
      <h1 className="text-[56px] leading-[1.02] tracking-[-0.04em]">Priced with your lanes, not a generic seat count.</h1>
      <p className="mt-5 text-lg text-mist">
        Access is invited. We will price the workspace to the volume and modes you actually run. No published rate card in this preview.
      </p>
      <Link to="/access" className="mt-8 inline-flex min-h-11 items-center rounded-[12px] bg-blue px-5 text-[#07090D]">
        Request access
      </Link>
    </section>
  )
}

export function Resources() {
  return (
    <section className="mx-auto max-w-[960px] px-6 pb-24 pt-32">
      <h1 className="text-[56px] leading-[1.02] tracking-[-0.04em]">Resources</h1>
      <ul className="mt-8 space-y-3 text-mist">
        <li>Documentation and API notes live with Developers.</li>
        <li>Security and status are listed here as placeholders until those surfaces ship.</li>
        <li>About and careers: write to info@myshipfront.com.</li>
      </ul>
    </section>
  )
}

export function Contact() {
  return (
    <section className="mx-auto max-w-[720px] px-6 pb-24 pt-32">
      <h1 className="text-[56px] leading-[1.02] tracking-[-0.04em]">Visit Us Today</h1>
      <address className="mt-6 not-italic text-lg text-mist">
        Shipfront<br />
        1933 S. Broadway<br />
        Los Angeles, CA 90007
      </address>
      <p className="mt-4 text-mist">
        Mon-Fri 9 am-5 pm. Sat-Sun appointment only.
      </p>
      <p className="mt-4">
        <a className="underline" href="mailto:info@myshipfront.com">info@myshipfront.com</a>
      </p>
      <Link to="/access" className="mt-8 inline-flex min-h-11 items-center rounded-[12px] bg-blue px-5 text-[#07090D]">
        Request access
      </Link>
    </section>
  )
}
