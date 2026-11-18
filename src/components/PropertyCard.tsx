import { Link } from "react-router-dom";
import { Bath, BedDouble, CarFront, Heart, MapPin, Ruler, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Property } from "../types";
import { cn } from "../utils/cn";
import { formatNumber, formatPrice } from "../utils/helpers";
import { useProperties } from "../context/PropertyContext";
import { StatusBadge } from "./ui";

export default function PropertyCard({ property }: { property: Property }) {
  const { toggleFavorite, isFavorite } = useProperties();
  const p = property;
  const fav = isFavorite(p.id);

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink-950/10">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/properties/${p.id}`} aria-label={`View ${p.title}`}>
          <img
            src={p.images[0]}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" />
        </Link>

        {/* Top row chips */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={p.status} />
          <span className="chip bg-white/90 text-ink-900 backdrop-blur-sm">
            {p.purpose === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
        {p.verified ? (
          <span className="chip absolute bottom-3 left-3 bg-ink-950/75 text-brass-200 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified listing
          </span>
        ) : (
          <span className="chip absolute bottom-3 left-3 bg-amber-500/90 text-white backdrop-blur-sm">
            <ShieldAlert className="h-3.5 w-3.5" /> Verification pending
          </span>
        )}

        <button
          onClick={() => toggleFavorite(p.id)}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={fav}
          className={cn(
            "absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90",
            fav ? "bg-brass-500 text-white shadow-lg shadow-brass-500/40" : "bg-white/85 text-ink-900 hover:bg-white",
          )}
        >
          <Heart className={cn("h-4.5 w-4.5 transition", fav && "fill-current")} />
        </button>

        {/* Price */}
        <p className="display absolute right-4 bottom-3 text-xl font-semibold text-white drop-shadow-lg">
          {formatPrice(p.price, p.purpose)}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-brass-600 uppercase">
          {p.propertyType}
          <span className="h-0.5 w-0.5 rounded-full bg-brass-500" />
          {p.city}
        </div>
        <Link to={`/properties/${p.id}`} className="mt-1.5">
          <h3 className="display text-lg leading-snug font-semibold text-ink-950 transition-colors group-hover:text-brass-700">
            {p.title}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" />
          {p.location}
        </p>

        {/* Specs */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink-900/8 pt-4 text-xs font-medium text-ink-600">
          {p.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-brass-600" /> {p.bedrooms} Beds
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-brass-600" /> {p.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-brass-600" /> {formatNumber(p.area)} sqft
          </span>
          <span className="flex items-center gap-1.5">
            <CarFront className="h-4 w-4 text-brass-600" /> {p.parking}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2.5 pt-1">
          <Link to={`/properties/${p.id}`} className="btn-primary btn-sm flex-1">
            View details
          </Link>
          <Link to={`/properties/${p.id}#agent`} className="btn-outline btn-sm flex-1">
            Contact agent
          </Link>
        </div>
      </div>
    </article>
  );
}
