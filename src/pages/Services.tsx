import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Calculator,
  Check,
  ClipboardCheck,
  HandCoins,
  KeyRound,
  LineChart,
  MessagesSquare,
  Phone,
} from "lucide-react";
import { Reveal, SectionHeading } from "../components/ui";

const SERVICES = [
  {
    icon: KeyRound,
    title: "Property Buying",
    text: "From first shortlist to final walkthrough, your buyer's agent handles search, strategy, negotiation and closing coordination.",
    points: ["Curated shortlists within 48 hours", "Private tours, in person or video", "Offer strategy backed by comparable sales"],
  },
  {
    icon: HandCoins,
    title: "Property Selling",
    text: "Full-service marketing that reaches qualified buyers — with honest pricing advice from day one.",
    points: ["Professional photography & staging plan", "Listings on all major portals", "Weekly performance reporting"],
  },
  {
    icon: Building2,
    title: "Property Renting",
    text: "Verified rentals with transparent terms for tenants, and reliable placement services for landlords.",
    points: ["Every landlord's ownership verified", "Clear deposit & fee disclosure", "Tenant screening and lease prep"],
  },
  {
    icon: Calculator,
    title: "Property Valuation",
    text: "A written, evidence-based valuation using recent comparable sales — delivered within two working days.",
    points: ["Comparable-sales evidence pack", "As-is vs renovated scenarios", "Rental yield estimate included"],
  },
  {
    icon: ClipboardCheck,
    title: "Property Management",
    text: "Hands-off ownership: vetted tenants, on-time rent and proactive maintenance with monthly reporting.",
    points: ["Rigorous tenant vetting", "24/7 maintenance coordination", "Monthly owner statements"],
  },
  {
    icon: MessagesSquare,
    title: "Real Estate Consultation",
    text: "Independent advice on purchases, sales timing, relocation and legal paperwork — billed by the hour, no strings.",
    points: ["60–90 minute deep-dive sessions", "Contract & disclosure review", "Neighborhood due-diligence packs"],
  },
  {
    icon: LineChart,
    title: "Investment Consultation",
    text: "Data-led portfolio building: yield modeling, growth corridors and honest risk assessment.",
    points: ["Cash-flow & appreciation modeling", "Short-term rental regulation guidance", "Portfolio review every quarter"],
  },
];

const PROCESS = [
  { step: "01", title: "Consultation", text: "We map your goals, budget and timeline — and tell you honestly what's realistic." },
  { step: "02", title: "Strategy", text: "A written plan: shortlist or pricing, timeline, and the data behind our recommendation." },
  { step: "03", title: "Execution", text: "Tours, offers, negotiations and inspections — coordinated by one accountable agent." },
  { step: "04", title: "Closing & beyond", text: "Paperwork, keys, movers, utilities — plus a check-in at 30 and 90 days." },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-950 pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-brass-300">Services</p>
          <h1 className="display mt-5 text-4xl leading-tight font-semibold text-balance text-white sm:text-6xl">
            Everything between <span className="text-brass-300">searching</span> and keys in hand
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Seven specialist services, one accountable team. Fixed quotes before we start — no surprise fees at closing.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <div className="card group flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="grid h-13 w-13 place-items-center rounded-2xl bg-cream text-brass-700 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-brass-300">
                  <s.icon className="h-6 w-6" />
                </span>
                <h2 className="display mt-6 text-xl font-semibold text-ink-950">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{s.text}</p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-ink-900/8 pt-5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm font-medium text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {pt}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brass-600 uppercase transition hover:gap-3">
                  Enquire about this <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}

          {/* CTA card fills the 8th grid cell */}
          <Reveal delay={180}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-ink-950 p-8 text-white">
              <div>
                <h2 className="display text-2xl leading-snug font-semibold text-balance">
                  Not sure which service fits?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Tell us your situation in two sentences. We'll point you to the right specialist — even if the honest
                  answer is "you don't need us yet."
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/contact" className="btn-brass btn-md w-full">Get in touch</Link>
                <a href="tel:+15125550192" className="btn-outline-light btn-md w-full">
                  <Phone className="h-4 w-4" /> (512) 555-0192
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream/60 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="How we work"
            title="A clear process, in writing"
            sub="No vague promises. Every engagement follows the same four documented stages."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 100}>
                <div className="relative h-full rounded-3xl border border-ink-900/8 bg-white p-7">
                  <span className="display text-5xl font-semibold text-brass-200">{p.step}</span>
                  <h3 className="display mt-4 text-lg font-semibold text-ink-950">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.text}</p>
                  {i < PROCESS.length - 1 && (
                    <ArrowRight className="absolute top-1/2 -right-4.5 z-10 hidden h-5 w-5 -translate-y-1/2 text-brass-500 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 sm:py-24">
        <Reveal>
          <div className="rounded-[2.5rem] bg-ink-950 p-10 text-center sm:p-16">
            <h2 className="display mx-auto max-w-2xl text-3xl leading-tight font-semibold text-balance text-white sm:text-4xl">
              Start with a free 20-minute consultation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
              No obligation. You'll leave knowing exactly what your next step should be — with us or without us.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-brass btn-lg">Book a consultation</Link>
              <Link to="/properties" className="btn-outline-light btn-lg">Browse properties</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
