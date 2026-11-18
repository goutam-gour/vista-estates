import type { Purpose } from "../types";

/** "$1,250,000" for sale properties, "$2,350/mo" for rentals */
export function formatPrice(price: number, purpose: Purpose): string {
  const base = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return purpose === "rent" ? `${base}/mo` : base;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** URL for a keyless OpenStreetMap embed centered on a coordinate */
export function osmEmbed(lat: number, lng: number, zoom = 0.045): string {
  const latDelta = zoom / 2;
  const lngDelta = zoom;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - lngDelta}%2C${lat - latDelta}%2C${lng + lngDelta}%2C${lat + latDelta}&layer=mapnik&marker=${lat}%2C${lng}`;
}

/* ---------------- Safe localStorage ---------------- */
export function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

/* ---------------- Validation ---------------- */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^[+()\-.\s\d]{7,20}$/.test(v.trim());
export const required = (v: string) => v.trim().length > 0;

export type Errors = Record<string, string>;
