import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, MapPin, Search } from "lucide-react";
import { cn } from "../utils/cn";
import type { Purpose } from "../types";
import { PROPERTY_TYPES } from "../data/properties";

const SALE_MIN = [0, 250000, 500000, 750000, 1000000, 1500000, 2000000];
const SALE_MAX = [500000, 750000, 1000000, 1500000, 2000000, 3000000, 4000000];
const RENT_MIN = [0, 1000, 1500, 2000, 2500, 3000];
const RENT_MAX = [1500, 2000, 2500, 3000, 4000, 5000];

function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  if (n >= 100_000) return `$${n / 1000}K`;
  return `$${n.toLocaleString("en-US")}`;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const mins = purpose === "buy" ? SALE_MIN : RENT_MIN;
  const maxs = purpose === "buy" ? SALE_MAX : RENT_MAX;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("purpose", purpose);
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-3xl bg-white/95 p-3 shadow-2xl shadow-ink-950/25 backdrop-blur-xl sm:p-4"
    >
      {/* Purpose tabs */}
      <div className="flex gap-2 px-1 pb-3">
        {(["buy", "rent"] as Purpose[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPurpose(p);
              setMin("");
              setMax("");
            }}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all",
              purpose === p ? "bg-ink-900 text-white shadow" : "text-ink-500 hover:bg-cream",
            )}
          >
            {p === "buy" ? "For Sale" : "For Rent"}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.85fr_0.85fr_auto]">
        {/* Location */}
        <label className="relative block">
          <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brass-600" />
          <span className="sr-only">Location, neighborhood or property name</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Location, neighborhood or name…"
            className="input border-transparent bg-cream/70 py-3.5 pl-11 hover:bg-cream focus:bg-white"
          />
        </label>

        {/* Type */}
        <label className="relative block">
          <Home className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brass-600" />
          <span className="sr-only">Property type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input cursor-pointer appearance-none border-transparent bg-cream/70 py-3.5 pl-11 hover:bg-cream focus:bg-white"
          >
            <option value="">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {/* Min price */}
        <label className="relative block">
          <span className="sr-only">Minimum price</span>
          <select
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="input cursor-pointer appearance-none border-transparent bg-cream/70 py-3.5 hover:bg-cream focus:bg-white"
          >
            <option value="">Min price</option>
            {mins.map((m) => (
              <option key={m} value={m}>
                {m === 0 ? "No min" : money(m)}
              </option>
            ))}
          </select>
        </label>

        {/* Max price */}
        <label className="relative block">
          <span className="sr-only">Maximum price</span>
          <select
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="input cursor-pointer appearance-none border-transparent bg-cream/70 py-3.5 hover:bg-cream focus:bg-white"
          >
            <option value="">Max price</option>
            {maxs.map((m) => (
              <option key={m} value={m}>
                {money(m)}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn-brass btn-lg sm:col-span-2 lg:col-span-1 lg:px-6">
          <Search className="h-4.5 w-4.5" /> Search
        </button>
      </div>
    </form>
  );
}
