import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, Search, SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { EmptyState, Reveal, SkeletonCard } from "../components/ui";
import { cn } from "../utils/cn";
import type { Purpose } from "../types";

interface Filters {
  q: string;
  city: string;
  type: string;
  purpose: "all" | Purpose;
  min: string;
  max: string;
  beds: string;
  status: string;
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  q: "",
  city: "",
  type: "",
  purpose: "all",
  min: "",
  max: "",
  beds: "",
  status: "",
  sort: "newest",
};

export default function Properties() {
  const { properties, loading, error } = useProperties();
  const [params] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    q: params.get("q") ?? "",
    type: params.get("type") ?? "",
    purpose: (params.get("purpose") as Filters["purpose"]) ?? "all",
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
    sort: params.get("sort") ?? "newest",
  }));

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));

  /* Simulate a network round-trip when filters change so loading states are genuine */
  useEffect(() => {
    setFiltering(true);
    const t = window.setTimeout(() => setFiltering(false), 300);
    return () => window.clearTimeout(t);
  }, [filters]);

  const cities = useMemo(() => [...new Set(properties.map((p) => p.city))].sort(), [properties]);

  const results = useMemo(() => {
    let list = [...properties];
    const q = filters.q.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.location, p.city, p.propertyType].join(" ").toLowerCase().includes(q),
      );
    }
    if (filters.city) list = list.filter((p) => p.city === filters.city);
    if (filters.type) list = list.filter((p) => p.propertyType === filters.type);
    if (filters.purpose !== "all") list = list.filter((p) => p.purpose === filters.purpose);
    if (filters.min) list = list.filter((p) => p.price >= Number(filters.min));
    if (filters.max) list = list.filter((p) => p.price <= Number(filters.max));
    if (filters.beds) list = list.filter((p) => p.bedrooms >= Number(filters.beds));
    if (filters.status) list = list.filter((p) => p.status === filters.status);

    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    }
    return list;
  }, [properties, filters]);

  const activeCount =
    Number(Boolean(filters.q || filters.city || filters.type)) +
    Number(filters.purpose !== "all") +
    Number(Boolean(filters.min || filters.max)) +
    Number(Boolean(filters.beds || filters.status));

  const reset = () => setFilters(DEFAULT_FILTERS);

  const selectCls = "input cursor-pointer appearance-none py-2.5 text-[13px]";
  const labelCls = "label";

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Keyword</label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Name, street, area…"
            className="input py-2.5 pl-10 text-[13px]"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>City / Area</label>
        <select value={filters.city} onChange={(e) => set("city", e.target.value)} className={selectCls}>
          <option value="">All areas</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Property type</label>
        <select value={filters.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Purpose</label>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-cream p-1">
          {(["all", "buy", "rent"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("purpose", v)}
              className={cn(
                "rounded-lg py-2 text-xs font-bold tracking-wide uppercase transition",
                filters.purpose === v ? "bg-ink-900 text-white shadow" : "text-ink-500 hover:text-ink-900",
              )}
            >
              {v === "all" ? "All" : v === "buy" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Price range ($)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.min}
            onChange={(e) => set("min", e.target.value)}
            placeholder="Min"
            className="input py-2.5 text-[13px]"
          />
          <span className="text-ink-300">—</span>
          <input
            type="number"
            min={0}
            value={filters.max}
            onChange={(e) => set("max", e.target.value)}
            placeholder="Max"
            className="input py-2.5 text-[13px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Bedrooms</label>
          <select value={filters.beds} onChange={(e) => set("beds", e.target.value)} className={selectCls}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((b) => (
              <option key={b} value={b}>
                {b}+
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
            <option value="">All</option>
            {PROPERTY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={reset} className="btn-ghost btn-sm w-full border border-ink-900/10">
          <X className="h-3.5 w-3.5" /> Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="bg-ink-950 pt-32 pb-14 sm:pt-36">
        <div className="container-x">
          <p className="eyebrow text-brass-300">The portfolio</p>
          <h1 className="display mt-4 text-4xl font-semibold text-white sm:text-5xl">Browse properties</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Every listing shows its true status — available, pending, sold or rented — and its verification state.
            Sold homes stay visible so you can study real market results.
          </p>
        </div>
      </section>

      <div className="container-x py-10 sm:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[290px_1fr]">
          {/* Desktop sidebar */}
          <aside className="card sticky top-24 hidden p-6 lg:block">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-bold tracking-widest text-ink-900 uppercase">
              <SlidersHorizontal className="h-4 w-4 text-brass-600" /> Refine search
            </h2>
            {FilterPanel}
          </aside>

          {/* Main column */}
          <div>
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink-600">
                <span className="display text-2xl font-semibold text-ink-950">{results.length}</span>{" "}
                {results.length === 1 ? "property" : "properties"} found
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setMobileFilters((v) => !v)}
                  className="btn-outline btn-sm lg:hidden"
                  aria-expanded={mobileFilters}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                  {activeCount > 0 && (
                    <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-brass-500 text-[10px] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
                  <select
                    value={filters.sort}
                    onChange={(e) => set("sort", e.target.value)}
                    className="input cursor-pointer appearance-none py-2.5 pr-4 pl-10 text-[13px]"
                    aria-label="Sort properties"
                  >
                    <option value="newest">Newest first</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile filter panel */}
            {mobileFilters && <div className="card fade-in mb-6 p-5 lg:hidden">{FilterPanel}</div>}

            {/* States */}
            {error ? (
              <EmptyState
                title="We couldn't load listings"
                message={error}
                action={
                  <button onClick={() => window.location.reload()} className="btn-primary btn-md mt-2">
                    Retry
                  </button>
                }
              />
            ) : loading || filtering ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                title="No homes match those filters"
                message="Try widening your price range, removing the bedroom minimum, or clearing the keyword search."
                action={
                  <button onClick={reset} className="btn-primary btn-md mt-2">
                    Reset all filters
                  </button>
                }
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i, 5) * 60}>
                    <PropertyCard property={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
