import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  HandCoins,
  KeyRound,
  LineChart,
  MapPin,
  Quote,
  ShieldCheck,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { IMAGES, testimonials } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import { Avatar, Reveal, SectionHeading, SkeletonCard, Stat } from "../components/ui";

const CATEGORY_IMAGES: Record<string, string> = {
  House: IMAGES.craftsman,
  Villa: IMAGES.villa,
  Apartment: IMAGES.apartment,
  Penthouse: IMAGES.penthouse,
  Loft: IMAGES.loft,
  Townhouse: IMAGES.townhome,
  Estate: IMAGES.ranch,
  Commercial: IMAGES.office,
};

const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Verified listings only",
    text: "Title, ownership and pricing documents are checked by our compliance team before any property earns the verified badge.",
  },
  {
    icon: HandCoins,
    title: "Honest, data-led pricing",
    text: "Every valuation is backed by comparable sales — never inflated to win a listing, never deflated to force a quick deal.",
  },
  {
    icon: Users,
    title: "Specialist local agents",
    text: "Our agents live in the neighborhoods they serve. You get street-level insight, not a call-center script.",
  },
  {
    icon: KeyRound,
    title: "End-to-end support",
    text: "Financing introductions, inspections, negotiation and closing coordination — one accountable team throughout.",
  },
];

const SERVICES_PREVIEW = [
  { icon: KeyRound, title: "Property Buying", text: "Shortlists matched to your budget, guided tours and firm negotiation at offer time." },
  { icon: Tag, title: "Property Selling", text: "Staging advice, professional photography and targeted marketing that reaches real buyers." },
  { icon: Building2, title: "Property Renting", text: "Verified rentals with transparent terms — for tenants and for landlords alike." },
  { icon: Calculator, title: "Property Valuation", text: "Market-accurate valuations from comparable data, delivered in 48 hours." },
  { icon: ClipboardCheck, title: "Property Management", text: "Tenant vetting, rent collection and maintenance with monthly owner reporting." },
  { icon: LineChart, title: "Investment Advisory", text: "Rental-yield and appreciation analysis to grow a portfolio that actually performs." },
];

export default function Home() {
  const { properties, loading } = useProperties();
  const navigate = useNavigate();
  const [tIndex, setTIndex] = useState(0);

  const featured = useMemo(() => properties.filter((p) => p.featured).slice(0, 3), [properties]);
  const latest = useMemo(
    () => [...properties].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 4),
    [properties],
  );
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    properties.forEach((p) => map.set(p.propertyType, (map.get(p.propertyType) ?? 0) + 1));
    return [...map.entries()].map(([type, count]) => ({ type, count }));
  }, [properties]);

  return (
  <div className="w-full max-w-full overflow-x-clip">
      {/* ============================== HERO ============================== */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Modern glass mansion at dusk" className="ken-burns h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/35 to-ink-950/85" />
        </div>

        <div className="container-x relative z-10 pt-32 pb-16 sm:pt-36">
          <div className="max-w-3xl">
            <p className="hero-rise eyebrow text-brass-300" style={{ "--rise-delay": "100ms" } as React.CSSProperties}>
              Austin's boutique brokerage · since 2009
            </p>
            <h1
              className="hero-rise display mt-6 text-[2.75rem] leading-[1.05] font-semibold text-balance text-white sm:text-6xl lg:text-7xl"
              style={{ "--rise-delay": "220ms" } as React.CSSProperties}
            >
              Find a home that <span className="text-brass-300">fits your life</span>
            </h1>
            <p
              className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
              style={{ "--rise-delay": "340ms" } as React.CSSProperties}
            >
              Browse verified homes, penthouses and investment properties across Greater Austin — with honest pricing
              and specialists who pick up the phone.
            </p>
          </div>

          <div className="hero-rise mt-10" style={{ "--rise-delay": "460ms" } as React.CSSProperties}>
            <SearchBar />
          </div>

          <div
            className="hero-rise mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-white/75"
            style={{ "--rise-delay": "580ms" } as React.CSSProperties}
          >
            {[
              ["2,400+", "homes matched"],
              ["$1.2B", "in closed volume"],
              ["98%", "client satisfaction"],
            ].map(([v, l]) => (
              <div key={l} className="flex items-center gap-3">
                <span className="display text-2xl font-semibold text-brass-300">{v}</span>
                <span className="max-w-24 text-xs leading-snug font-medium tracking-wide uppercase">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FEATURED ============================== */}
      <section className="container-x py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured properties"
            sub="A rotating selection of standout homes — each physically visited and document-verified by our team."
          />
          <Reveal delay={150}>
            <Link to="/properties" className="btn-outline btn-md">
              View all properties <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 120}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* ============================== CATEGORIES ============================== */}
      <section className="bg-cream/60 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Browse by type"
            title="Explore property categories"
            sub="From downtown lofts to hill-country estates — start with the lifestyle you're after."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(({ type, count }, i) => (
              <Reveal key={type} delay={i * 70}>
                <button
                  onClick={() => navigate(`/properties?type=${encodeURIComponent(type)}`)}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl text-left"
                >
                  <img
                    src={CATEGORY_IMAGES[type] ?? IMAGES.hero}
                    alt={type}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent transition group-hover:from-ink-950/90" />
                  <span className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-2">
                    <span>
                      <span className="display block text-lg leading-tight font-semibold text-white sm:text-xl">
                        {type}s
                      </span>
                      <span className="mt-1 block text-xs font-medium text-white/70">
                        {count} {count === 1 ? "listing" : "listings"}
                      </span>
                    </span>
                    <span className="grid h-9 w-9 shrink-0 translate-y-1 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== WHY CHOOSE US ============================== */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image side */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem]">
              <img src={IMAGES.villa} alt="Modern villa verified by Vista Estates" className="aspect-[4/3.4] w-full object-cover" />
            </div>
            <div className="float-y absolute -right-3 -bottom-6 hidden rounded-3xl bg-ink-950 p-6 text-white shadow-2xl sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brass-500">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="display text-2xl font-semibold">100%</p>
                  <p className="text-xs text-white/60">title-checked listings</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-5 -left-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:-left-6">
              <div className="flex items-center gap-2">
                <div className="flex text-brass-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-ink-900">4.9 / 5 · 1,100+ client reviews</p>
            </div>
          </Reveal>

          {/* Copy side */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Why Vista Estates"
              title="A brokerage built on trust, not pressure"
              sub="We publish sold and rented listings alongside live ones, badge every verification state, and tell you when a home isn't worth its price. That's how an agency should behave."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {WHY_US.map((w, i) => (
                <Reveal key={w.title} delay={i * 90}>
                  <div className="card group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-brass-700 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-brass-300">
                      <w.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-semibold text-ink-950">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{w.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== STATS ============================== */}
      <section className="bg-ink-950 py-16 sm:py-20">
        <div className="container-x grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          <Stat value={17} suffix=" yrs" label="Serving Greater Austin" />
          <Stat value={2400} suffix="+" label="Homes matched" />
          <Stat value={98} suffix="%" label="Client satisfaction" />
          <Stat value={42} suffix="" label="Neighborhoods covered" />
        </div>
      </section>

      {/* ============================== LATEST ============================== */}
      <section className="container-x py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Fresh on the market"
            title="Latest properties"
            sub="Newest instructions across Austin — updated as soon as listings clear verification."
          />
          <Reveal delay={150}>
            <Link to="/properties?sort=newest" className="btn-outline btn-md">
              See what's new <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : latest.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* ============================== SERVICES ============================== */}
      <section className="bg-cream/60 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="What we do"
            title="Full-service real estate"
            sub="One accountable team for buying, selling, renting, valuation and management."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_PREVIEW.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <Link
                  to="/services"
                  className="card group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-ink-950 hover:shadow-xl"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-brass-700 transition group-hover:bg-brass-500 group-hover:text-white">
                    <s.icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="display mt-5 text-lg font-semibold text-ink-950 transition group-hover:text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500 transition group-hover:text-white/60">
                    {s.text}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brass-600 uppercase transition group-hover:text-brass-300">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Client stories"
              title="Trusted by buyers, sellers and investors"
              sub="Real words from real closings. Every review below comes from a completed transaction."
            />
            <Reveal delay={200} className="mt-8 flex gap-3">
              <button
                onClick={() => setTIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
                className="grid h-12 w-12 place-items-center rounded-full border border-ink-900/15 text-ink-900 transition hover:border-ink-900 hover:bg-ink-900 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setTIndex((i) => (i + 1) % testimonials.length)}
                aria-label="Next testimonial"
                className="grid h-12 w-12 place-items-center rounded-full bg-ink-900 text-white transition hover:bg-ink-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${tIndex * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <figure key={t.name} className="card w-full shrink-0 p-8 sm:p-10">
                    <Quote className="h-8 w-8 text-brass-400" />
                    <blockquote className="display mt-5 text-xl leading-relaxed font-medium text-balance text-ink-900 sm:text-2xl">
                      "{t.quote}"
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      <Avatar name={t.name} />
                      <div>
                        <p className="text-sm font-semibold text-ink-950">{t.name}</p>
                        <p className="text-xs text-ink-400">{t.role}</p>
                      </div>
                      <div className="ml-auto flex text-brass-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={
                    i === tIndex
                      ? "h-2 w-8 rounded-full bg-brass-500 transition-all"
                      : "h-2 w-2 rounded-full bg-ink-900/15 transition-all hover:bg-ink-900/30"
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="container-x pb-20 sm:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950">
            <img src={IMAGES.hero} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />
            <div className="relative z-10 max-w-2xl p-10 sm:p-16 lg:p-20">
              <p className="eyebrow text-brass-300">Ready when you are</p>
              <h2 className="display mt-5 text-3xl leading-tight font-semibold text-balance text-white sm:text-5xl">
                Let's find the keys to your next chapter
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
                Book a free 20-minute consultation. No obligation, no scripts — just a clear read on what your budget
                can do in today's market.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/properties" className="btn-brass btn-lg">
                  Browse properties <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-outline-light btn-lg">
                  <MapPin className="h-4 w-4" /> Talk to an agent
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
