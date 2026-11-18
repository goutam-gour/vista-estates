
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  CalendarClock,
  CarFront,
  Check,
  ChevronRight,
  Flag,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Share2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { EnquiryForm, Field, inputCls } from "../components/forms";
import {
  Avatar,
  EmptyState,
  Modal,
  PageLoader,
  StatusBadge,
  Reveal,
} from "../components/ui";
import { cn } from "../utils/cn";
import {
  formatDate,
  formatNumber,
  formatPrice,
  osmEmbed,
  timeAgo,
  type Errors,
} from "../utils/helpers";
import { createVisitAPI } from "../services/visitService";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const {
    properties,
    loading,
    agentOf,
    toggleFavorite,
    isFavorite,
    addReport,
    toast,
  } = useProperties();

  const property = properties.find((p) => p.id === id);
  const agent = property ? agentOf(property.agentId) : undefined;

  const [activeImg, setActiveImg] = useState(0);
  const [visitOpen, setVisitOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Reset gallery when navigating between properties
  useEffect(() => {
    setActiveImg(0);
  }, [id]);

  // Honor agent hash links from cards
  useEffect(() => {
    if (location.hash === "#agent" && property) {
      window.setTimeout(() => {
        document.getElementById("agent")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    }
  }, [location.hash, property]);

  const similar = useMemo(() => {
    if (!property) return [];

    return properties
      .filter((p) => p.id !== property.id)
      .sort((a, b) => {
        const score = (x: typeof a) =>
          Number(x.propertyType === property.propertyType) * 2 +
          Number(x.city === property.city);

        return score(b) - score(a);
      })
      .slice(0, 3);
  }, [properties, property]);

  if (loading) {
    return <PageLoader label="Loading property…" />;
  }

  if (!property) {
    return (
      <div className="container-x pt-40 pb-24">
        <EmptyState
          title="This listing doesn't exist"
          message="It may have been removed by our team, or the link is incorrect. Browse the live portfolio instead."
          action={
            <Link to="/properties" className="btn-primary btn-md mt-2">
              <ArrowLeft className="h-4 w-4" />
              Back to properties
            </Link>
          }
        />
      </div>
    );
  }

  const fav = isFavorite(property.id);
  const p = property;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard");
    } catch {
      toast("Couldn't copy the link", "error");
    }
  };

  const specs = [
    {
      icon: BedDouble,
      label: "Bedrooms",
      value: p.bedrooms > 0 ? String(p.bedrooms) : "Studio / Open",
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: String(p.bathrooms),
    },
    {
      icon: Ruler,
      label: "Living area",
      value: `${formatNumber(p.area)} sqft`,
    },
    {
      icon: CarFront,
      label: "Parking",
      value: `${p.parking} space${p.parking === 1 ? "" : "s"}`,
    },
    {
      icon: Home,
      label: "Type",
      value: p.propertyType,
    },
    {
      icon: CalendarClock,
      label: "Year built",
      value: String(p.yearBuilt),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container-x pt-24 sm:pt-28">
        {/* Breadcrumb + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <nav
            className="flex items-center gap-1.5 text-xs font-medium text-ink-500"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-ink-950">
              Home
            </Link>

            <ChevronRight className="h-3 w-3" />

            <Link to="/properties" className="hover:text-ink-950">
              Properties
            </Link>

            <ChevronRight className="h-3 w-3" />

            <span className="max-w-40 truncate text-ink-900">
              {p.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={share}
              className="btn-outline btn-sm"
              aria-label="Share listing"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>

            <button
              onClick={() => toggleFavorite(p.id)}
              className={cn(
                "btn btn-sm",
                fav
                  ? "bg-brass-500 text-white hover:bg-brass-600"
                  : "btn-outline"
              )}
              aria-pressed={fav}
            >
              <Heart
                className={cn("h-3.5 w-3.5", fav && "fill-current")}
              />
              {fav ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid gap-3">
          <div className="relative overflow-hidden rounded-[2rem]">
            <img
              key={activeImg}
              src={p.images[activeImg]}
              alt={`${p.title} — photo ${activeImg + 1}`}
              className="fade-in aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
            />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <StatusBadge status={p.status} />

              <span className="chip bg-white/90 text-ink-900 backdrop-blur-sm">
                {p.purpose === "rent" ? "For Rent" : "For Sale"}
              </span>
            </div>

            {p.verified ? (
              <span className="chip absolute bottom-4 left-4 bg-ink-950/75 text-brass-200 backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5" />
                Documents verified
              </span>
            ) : (
              <span className="chip absolute bottom-4 left-4 bg-amber-500/90 text-white backdrop-blur-sm">
                <ShieldAlert className="h-3.5 w-3.5" />
                Verification in progress
              </span>
            )}
          </div>

          {p.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {p.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={cn(
                    "relative aspect-[16/10] w-36 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 sm:w-44",
                    i === activeImg
                      ? "ring-2 ring-brass-500 ring-offset-2 ring-offset-paper"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title / price */}
        <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-brass-600 uppercase">
              {p.propertyType} · {p.city}
            </div>

            <h1 className="display mt-2 text-3xl leading-tight font-semibold text-ink-950 sm:text-4xl">
              {p.title}
            </h1>

            <p className="mt-2.5 flex items-center gap-2 text-sm text-ink-500">
              <MapPin className="h-4 w-4 shrink-0 text-brass-600" />
              {p.location}, {p.city}, TX · Listed {timeAgo(p.dateAdded)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold tracking-widest text-ink-400 uppercase">
              {p.status === "Sold"
                ? "Sold for"
                : p.status === "Rented"
                  ? "Leased at"
                  : "Asking price"}
            </p>

            <p className="display mt-1 text-3xl font-semibold text-ink-950 sm:text-4xl">
              {formatPrice(p.price, p.purpose)}
            </p>

            {p.purpose === "buy" && (
              <p className="mt-1 text-xs text-ink-400">
                ≈ ${Math.round(p.price / p.area).toLocaleString()} per sqft
              </p>
            )}
          </div>
        </div>

        {/* Spec band */}
        <Reveal className="card mt-8 grid grid-cols-2 divide-ink-900/8 overflow-hidden sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {specs.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 border-ink-900/8 px-4 py-5 text-center max-lg:border-b max-sm:odd:border-r"
            >
              <s.icon className="h-5 w-5 text-brass-600" />

              <p className="text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                {s.label}
              </p>

              <p className="text-sm font-bold text-ink-950">
                {s.value}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Content grid */}
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-12">
            {/* Description */}
            <section>
              <h2 className="display text-2xl font-semibold text-ink-950">
                About this home
              </h2>

              {p.description.split("\n\n").map((para, i) => (
                <p key={i} className="mt-4 leading-relaxed text-ink-600">
                  {para}
                </p>
              ))}
            </section>

            {/* Features */}
            <section>
              <h2 className="display text-2xl font-semibold text-ink-950">
                Property features
              </h2>

              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-ink-600"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="display flex items-center gap-2.5 text-2xl font-semibold text-ink-950">
                <Sparkles className="h-5 w-5 text-brass-500" />
                Amenities
              </h2>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {p.amenities.map((a) => (
                  <span
                    key={a}
                    className="chip border border-ink-900/10 bg-white py-2 text-ink-700 normal-case"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>

            {/* Map */}
            <section>
              <h2 className="display text-2xl font-semibold text-ink-950">
                Location
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
                <MapPin className="h-4 w-4 text-brass-600" />
                {p.location}, {p.city}, TX
              </p>

              <div className="card mt-5 overflow-hidden">
                <iframe
                  title={`Map of ${p.location}`}
                  src={osmEmbed(p.lat, p.lng)}
                  className="h-80 w-full border-0"
                  loading="lazy"
                />
              </div>

              <p className="mt-3 text-xs text-ink-400">
                Map shows the approximate neighborhood. Exact address is shared
                after a confirmed tour booking.
              </p>
            </section>
          </div>

          {/* Right column — agent card */}
          <aside id="agent" className="space-y-6 lg:sticky lg:top-24">
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <Avatar
                  name={agent?.name ?? "Vista Estates"}
                  className="h-14 w-14 text-base"
                />

                <div>
                  <p className="text-[11px] font-bold tracking-widest text-brass-600 uppercase">
                    Listing agent
                  </p>

                  <h3 className="display text-lg font-semibold text-ink-950">
                    {agent?.name ?? "Vista Estates Team"}
                  </h3>

                  <p className="text-xs text-ink-400">
                    {agent?.role ?? "Client Care"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5 text-sm">
                <a
                  href={`tel:${agent?.phone ?? "(512) 555-0192"}`}
                  className="flex items-center gap-3 rounded-xl bg-cream/70 px-4 py-3 font-medium text-ink-800 transition hover:bg-cream"
                >
                  <Phone className="h-4 w-4 text-brass-600" />
                  {agent?.phone ?? "(512) 555-0192"}
                </a>

                <a
                  href={`mailto:${agent?.email ?? "hello@vistaestates.com"}`}
                  className="flex items-center gap-3 rounded-xl bg-cream/70 px-4 py-3 font-medium break-all text-ink-800 transition hover:bg-cream"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brass-600" />
                  {agent?.email ?? "hello@vistaestates.com"}
                </a>
              </div>

              <button
                onClick={() => setVisitOpen(true)}
                disabled={p.status === "Sold" || p.status === "Rented"}
                className="btn-primary btn-lg mt-5 w-full"
              >
                <CalendarClock className="h-4.5 w-4.5" />
                {p.status === "Sold" || p.status === "Rented"
                  ? `Already ${p.status.toLowerCase()}`
                  : "Schedule a visit"}
              </button>

              <div className="my-6 h-px bg-ink-900/8" />

              <EnquiryForm propertyId={p.id} propertyTitle={p.title} />
            </div>

            <button
              onClick={() => setReportOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-900/15 py-3.5 text-xs font-semibold text-ink-400 transition hover:border-rose-300 hover:text-rose-600"
            >
              <Flag className="h-3.5 w-3.5" />
              Report this listing
            </button>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-20 border-t border-ink-900/8 pt-14 pb-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="display text-3xl font-semibold text-ink-950">
                Similar properties
              </h2>

              <Link to="/properties" className="btn-ghost btn-sm">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s, i) => (
                <Reveal key={s.id} delay={i * 90}>
                  <PropertyCard property={s} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Schedule visit modal */}
      <ScheduleVisitModal
        open={visitOpen}
        onClose={() => setVisitOpen(false)}
        onSubmit={async (date, time, name, email, phone) => {
          try {
            await createVisitAPI({
              property: p.id,
              name,
              email,
              phone,
              visitDate: date,
              visitTime: time,
              message: `Visit requested for ${formatDate(date)} at ${time}.`,
            });

            toast("Visit booked successfully!");
            setVisitOpen(false);
          } catch (error) {
            toast(
              error instanceof Error
                ? error.message
                : "Unable to book visit",
              "error"
            );
          }
        }}
      />

      {/* Report modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={(reason, details) => {
          addReport({
            propertyId: p.id,
            propertyTitle: p.title,
            reason,
            details,
          });

          toast(
            "Report submitted — our compliance team will review",
            "info"
          );

          setReportOpen(false);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ScheduleVisitModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    date: string,
    time: string,
    name: string,
    email: string,
    phone: string
  ) => Promise<void>;
}) {
  const [form, setForm] = useState({
    date: "",
    time: "10:00",
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: Errors = {};

    if (!form.date) {
      errs.date = "Pick a preferred date.";
    } else if (
      new Date(`${form.date}T00:00:00`) <
      new Date(new Date().toDateString())
    ) {
      errs.date = "Date must be today or in the future.";
    }

    if (form.name.trim().length < 2) {
      errs.name = "Your name is required.";
    }

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      errs.email = "Please enter a valid email address.";
    }

    if (form.phone.trim().length < 7) {
      errs.phone = "A phone number is required.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit(
        form.date,
        form.time,
        form.name.trim(),
        form.email.trim(),
        form.phone.trim()
      );

      setForm({
        date: "",
        time: "10:00",
        name: "",
        email: "",
        phone: "",
      });

      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title="Schedule a private tour"
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred date" required error={errors.date}>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className={inputCls(errors.date)}
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </Field>

          <Field label="Preferred time">
            <select
              className={inputCls()}
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            >
              {[
                "09:00",
                "10:00",
                "11:30",
                "13:00",
                "14:30",
                "16:00",
                "17:30",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Your name" required error={errors.name}>
          <input
            className={inputCls(errors.name)}
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Your name"
          />
        </Field>

        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            className={inputCls(errors.email)}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone" required error={errors.phone}>
          <input
            type="tel"
            className={inputCls(errors.phone)}
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            placeholder="Your phone number"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="btn-brass btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarClock className="h-4.5 w-4.5" />
          {submitting ? "Booking..." : "Request tour"}
        </button>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

const REPORT_REASONS = [
  "Inaccurate information",
  "Listing seems fraudulent",
  "Property no longer available",
  "Price is misleading",
  "Inappropriate content",
  "Other",
];

function ReportModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details?: string) => void;
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(reason, details.trim() || undefined);

    setDetails("");
    setReason(REPORT_REASONS[0]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report this listing"
    >
      <p className="-mt-3 mb-5 text-sm leading-relaxed text-ink-500">
        Reports go directly to our compliance team. Misleading listings are
        de-badged within 24 hours pending review.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Reason" required>
          <select
            className={inputCls()}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Details (optional)">
          <textarea
            rows={4}
            className={cn(inputCls(), "resize-none")}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Anything else we should know…"
          />
        </Field>

        <button
          type="submit"
          className="btn btn-lg w-full bg-rose-600 text-white hover:bg-rose-700"
        >
          <Flag className="h-4 w-4" />
          Submit report
        </button>
      </form>
    </Modal>
  );
}
