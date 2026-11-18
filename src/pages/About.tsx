import { Link } from "react-router-dom";
import { ArrowRight, Award, Check, Compass, Eye, HandHeart, Phone, ShieldCheck, Target } from "lucide-react";
import { IMAGES } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import { Avatar, Reveal, SectionHeading, Stat } from "../components/ui";

const TRUST_POINTS = [
  "Every listing's title and ownership documents are checked before publishing",
  "Sold and rented homes stay visible — we never hide real market results",
  "Unverified listings are clearly labeled instead of silently promoted",
  "A public report button on every property page, reviewed within 24 hours",
  "Written valuations backed by comparable sales, not guesswork",
  "Agents are salaried on service quality, not just commission volume",
];

export default function About() {
  const { agents } = useProperties();

  return (
    <div>
      {/* Hero band */}
      <section className="bg-ink-950 pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-brass-300">About Vista Estates</p>
          <h1 className="display mt-5 text-4xl leading-tight font-semibold text-balance text-white sm:text-6xl">
            Seventeen years of getting Austin <span className="text-brass-300">home</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            We started in 2009 with one office on South Congress and a simple rule: publish the truth about every
            property — the good listings, the sold ones, and the ones still waiting.
          </p>
        </div>
      </section>

      {/* Intro split */}
      <section className="container-x grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem]">
            <img src={IMAGES.ranch} alt="Willow Creek Ranch Estate, represented by Vista Estates" className="aspect-[4/3.2] w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 left-6 hidden rounded-3xl bg-white p-6 shadow-2xl sm:block">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brass-500 text-white">
                <Award className="h-6 w-6" />
              </span>
              <div>
                <p className="display text-2xl font-semibold text-ink-950">#1 Rated</p>
                <p className="text-xs text-ink-400">Boutique brokerage, Austin 2024–25</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="A local team with an obsessive standard for honesty"
            sub=""
          />
          <Reveal delay={120}>
            <p className="mt-6 leading-relaxed text-ink-600">
              Vista Estates is an independent, family-run brokerage serving Greater Austin. We're deliberately small —
              twenty-two agents, four offices, zero call centers — because trust is built person to person.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Our platform shows verification states, report buttons and closed results because we believe an informed
              client is a better client. When you know what homes really sell for, you make decisions you never regret.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Target, title: "Our mission", text: "Make every property decision in Austin an informed one — with verified data and honest counsel." },
              { icon: Eye, title: "Our vision", text: "A market where transparency is the default, not a differentiator. We're building it one listing at a time." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div className="card h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-brass-700">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink-950">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-950 py-16 sm:py-20">
        <div className="container-x grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          <Stat value={17} suffix=" yrs" label="In business since 2009" />
          <Stat value={2400} suffix="+" label="Successful transactions" />
          <Stat value={1.2} suffix="B" decimals={1} label="Dollars in closed volume" />
          <Stat value={98} suffix="%" label="Would recommend us" />
        </div>
      </section>

      {/* Trust */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Why clients trust us"
              title="Trust isn't a tagline. It's a checklist."
              sub="Six operating principles every Vista agent signs up to — and every client can hold us to."
            />
            <Reveal delay={150} className="mt-8">
              <Link to="/services" className="btn-primary btn-md">
                Explore our services <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="space-y-3.5">
            {TRUST_POINTS.map((point, i) => (
              <Reveal key={point} delay={i * 70}>
                <div className="card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed font-medium text-ink-700">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-cream/60 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="The team"
            title="Meet your specialists"
            sub="Licensed, local, and reachable. Every listing names its agent — including their direct line."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <div className="card group h-full p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <Avatar name={a.name} className="mx-auto h-20 w-20 text-xl" />
                  <h3 className="display mt-5 text-lg font-semibold text-ink-950">{a.name}</h3>
                  <p className="mt-1 text-xs font-bold tracking-widest text-brass-600 uppercase">{a.role}</p>
                  <p className="mt-3 text-sm text-ink-500">{a.listings} active listings</p>
                  <a
                    href={`tel:${a.phone}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink-900/10 px-4 py-2 text-xs font-semibold text-ink-700 transition group-hover:border-brass-500 group-hover:bg-brass-500 group-hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5" /> {a.phone}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Values strip */}
          <Reveal className="mt-16">
            <div className="grid gap-4 rounded-[2rem] bg-ink-950 p-8 text-white sm:grid-cols-3 sm:p-12">
              {[
                { icon: ShieldCheck, title: "Integrity first", text: "We'd rather lose a listing than misrepresent one." },
                { icon: Compass, title: "Local obsession", text: "We know the floor plans, the school zones and the flood maps." },
                { icon: HandHeart, title: "Service over sales", text: "Half our business is repeat clients and referrals." },
              ].map((v) => (
                <div key={v.title} className="flex flex-col items-center gap-3 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-brass-300">
                    <v.icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="display text-lg font-semibold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{v.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
