import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Info,
  Loader2,
  SearchX,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useProperties } from "../context/PropertyContext";
import type { PropertyStatus } from "../types";

/* ------------------------------ View hook ------------------------------ */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        }),
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

/* ------------------------------ Reveal ------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Loaders ------------------------------ */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin", className)} aria-label="Loading" />;
}

export function PageLoader({ label = "Loading listings…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-900">
        <Loader2 className="h-6 w-6 animate-spin text-brass-300" />
      </div>
      <p className="text-sm font-medium text-ink-500">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-2/3 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ------------------------------ Headers ------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <span className={cn("eyebrow", center && "justify-center")}>{eyebrow}</span>
      <h2
        className={cn(
          "display mt-4 text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-[2.75rem]",
          light ? "text-white" : "text-ink-950",
        )}
      >
        {title}
      </h2>
      {sub && <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/65" : "text-ink-500")}>{sub}</p>}
    </Reveal>
  );
}

/* ------------------------------ Badges ------------------------------ */
const STATUS_STYLES: Record<PropertyStatus, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Sold: "bg-rose-100 text-rose-700",
  Rented: "bg-sky-100 text-sky-800",
};

export function StatusBadge({ status, className }: { status: PropertyStatus; className?: string }) {
  return <span className={cn("chip", STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700", className)}>{status}</span>;
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("chip bg-ink-950/80 text-brass-200 backdrop-blur-sm", className)}>
      <ShieldCheck className="h-3.5 w-3.5" /> Verified
    </span>
  );
}

/* ------------------------------ Avatar ------------------------------ */
const AVATAR_HUES = ["bg-ink-800", "bg-brass-600", "bg-ink-600", "bg-brass-500", "bg-ink-900"];
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = AVATAR_HUES[name.length % AVATAR_HUES.length];
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-white",
        hue,
        className ?? "h-11 w-11 text-sm",
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}

/* ------------------------------ Stat ------------------------------ */
export function Stat({
  value,
  suffix = "",
  label,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <div ref={ref}>
      <p className="display text-4xl font-semibold text-brass-300 sm:text-5xl">
        {n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-white/60">{label}</p>
    </div>
  );
}

/* ------------------------------ Empty state ------------------------------ */
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cream text-ink-500">
        {icon ?? <SearchX className="h-7 w-7" />}
      </div>
      <h3 className="display text-xl font-semibold text-ink-950">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-500">{message}</p>
      {action}
    </div>
  );
}

/* ------------------------------ Modal ------------------------------ */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4" role="dialog" aria-modal="true">
      <button className="fade-in absolute inset-0 cursor-default bg-ink-950/60 backdrop-blur-sm" onClick={onClose} aria-label="Close dialog" />
      <div
        className={cn(
          "modal-in relative w-full rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto sm:p-8",
          wide ? "max-w-2xl" : "max-w-md",
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h3 className="display text-xl font-semibold text-ink-950">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-cream hover:text-ink-950"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ Confirm dialog ------------------------------ */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm leading-relaxed text-ink-600">{message}</p>
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button className="btn-outline btn-md" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn btn-md bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------ Toasts ------------------------------ */
const TOAST_STYLE = {
  success: { icon: CheckCircle2, bar: "bg-emerald-500", text: "text-emerald-600" },
  error: { icon: AlertTriangle, bar: "bg-rose-500", text: "text-rose-600" },
  info: { icon: Info, bar: "bg-brass-400", text: "text-brass-600" },
} as const;

export function Toasts() {
  const { toasts } = useProperties();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((t) => {
        const s = TOAST_STYLE[t.kind];
        const Icon = s.icon;
        return (
          <div key={t.id} className="toast-in pointer-events-auto flex items-center gap-3 overflow-hidden rounded-2xl border border-ink-900/5 bg-white py-3 pr-4 pl-0 shadow-xl shadow-ink-950/10">
            <span className={cn("h-full w-1 shrink-0 self-stretch rounded-r", s.bar)} />
            <Icon className={cn("h-5 w-5 shrink-0", s.text)} />
            <p className="text-sm font-medium text-ink-900">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}

export { BadgeCheck };
