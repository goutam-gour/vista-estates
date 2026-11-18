import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ImagePlus, Info, Save } from "lucide-react";
import { IMAGE_POOL, PROPERTY_STATUSES, PROPERTY_TYPES } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import { Field, inputCls } from "../components/forms";
import { EmptyState } from "../components/ui";
import { cn } from "../utils/cn";
import { uid, type Errors } from "../utils/helpers";
import type { Property, PropertyStatus, Purpose } from "../types";

interface FormState {
  title: string;
  propertyType: string;
  purpose: Purpose;
  price: string;
  city: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  parking: string;
  yearBuilt: string;
  status: PropertyStatus;
  verified: boolean;
  featured: boolean;
  agentId: string;
  lat: string;
  lng: string;
  description: string;
  amenities: string;
  features: string;
  images: string[];
}

const EMPTY: FormState = {
  title: "",
  propertyType: "House",
  purpose: "buy",
  price: "",
  city: "Austin",
  location: "",
  bedrooms: "3",
  bathrooms: "2",
  area: "",
  parking: "1",
  yearBuilt: "2020",
  status: "Available",
  verified: false,
  featured: false,
  agentId: "",
  lat: "30.2672",
  lng: "-97.7431",
  description: "",
  amenities: "",
  features: "",
  images: [],
};

export default function PropertyForm({ mode }: { mode: "add" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const { properties, agents, addProperty, updateProperty, toast } = useProperties();
  const navigate = useNavigate();

  const existing = useMemo(
    () => (mode === "edit" ? properties.find((p) => p.id === id) : undefined),
    [mode, properties, id],
  );

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [initialized, setInitialized] = useState(mode === "add");

  useEffect(() => {
    if (mode === "edit" && existing && !initialized) {
      setForm({
        title: existing.title,
        propertyType: existing.propertyType,
        purpose: existing.purpose,
        price: String(existing.price),
        city: existing.city,
        location: existing.location,
        bedrooms: String(existing.bedrooms),
        bathrooms: String(existing.bathrooms),
        area: String(existing.area),
        parking: String(existing.parking),
        yearBuilt: String(existing.yearBuilt),
        status: existing.status,
        verified: existing.verified,
        featured: existing.featured,
        agentId: existing.agentId,
        lat: String(existing.lat),
        lng: String(existing.lng),
        description: existing.description,
        amenities: existing.amenities.join(", "),
        features: existing.features.join(", "),
        images: existing.images,
      });
      setInitialized(true);
    }
  }, [mode, existing, initialized]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors({ ...errors, [key]: "" });
  };

  const toggleImage = (src: string) => {
    set("images", form.images.includes(src) ? form.images.filter((i) => i !== src) : [...form.images, src]);
  };

  if (mode === "edit" && !existing && properties.length > 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Listing not found"
          message="This property may have been deleted. Return to the inventory to pick another."
          action={
            <Link to="/admin/properties" className="btn-primary btn-md mt-2">
              <ArrowLeft className="h-4 w-4" /> Back to inventory
            </Link>
          }
        />
      </div>
    );
  }

    const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.title.trim().length < 5) errs.title = "Title needs at least 5 characters.";
    if (!form.price || Number(form.price) <= 0) errs.price = "Enter a price above 0.";
    if (!form.location.trim()) errs.location = "Street address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.area || Number(form.area) <= 0) errs.area = "Enter a valid area.";
    if (Number(form.bedrooms) < 0 || Number(form.bathrooms) < 0) errs.bedrooms = "Rooms can't be negative.";
    const year = Number(form.yearBuilt);
    if (!year || year < 1800 || year > 2026) errs.yearBuilt = "Enter a year between 1800 and 2026.";
    if (form.description.trim().length < 30) errs.description = "Description needs at least 30 characters.";
    if (form.images.length === 0) errs.images = "Select at least one photo.";
    if (!form.agentId) errs.agentId = "Assign a listing agent.";
    if (Number.isNaN(Number(form.lat)) || Number.isNaN(Number(form.lng))) errs.lat = "Enter valid coordinates.";

    setErrors(errs);
    if (Object.keys(errs).length) {
      toast("Please fix the highlighted fields", "error");
      document.getElementById("property-form-top")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const toList = (s: string) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    const base: Property = {
      id: existing?.id ?? uid("p"),
      title: form.title.trim(),
      location: form.location.trim(),
      city: form.city.trim(),
      price: Number(form.price),
      propertyType: form.propertyType,
      purpose: form.purpose,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      parking: Number(form.parking),
      status: form.status,
      verified: form.verified,
      featured: form.featured,
      yearBuilt: year,
      description: form.description.trim(),
      amenities: toList(form.amenities),
      features: toList(form.features),
      images: form.images,
      agentId: form.agentId,
      lat: Number(form.lat),
      lng: Number(form.lng),
      dateAdded: existing?.dateAdded ?? new Date().toISOString(),
    };

    
    try {
      if (mode === "edit") {
        await updateProperty(base);
        toast(`"${base.title}" updated successfully`);
      } else {
        await addProperty(base);
        toast(`"${base.title}" published successfully`);
      }

      navigate("/admin/properties");
    } catch (error) {
      console.error("Property save error:", error);

      toast(
        error instanceof Error
          ? error.message
          : "Unable to save property. Please try again.",
        "error"
      );
    }

  };

  const toggleCls = (checked: boolean) =>
    cn(
      "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition",
      checked ? "border-brass-500 bg-brass-100/60 text-ink-950" : "border-ink-900/10 bg-white text-ink-500 hover:border-ink-900/30",
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6" id="property-form-top">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/admin/properties" className="btn-ghost btn-sm -ml-3">
            <ArrowLeft className="h-3.5 w-3.5" /> Inventory
          </Link>
          <h1 className="display mt-2 text-3xl font-semibold text-ink-950">
            {mode === "edit" ? `Edit — ${existing?.title ?? ""}` : "Add a new property"}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Fields marked * are required. Publish only information you can stand behind.
          </p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          <div className="card space-y-5 p-6 sm:p-8">
            <h2 className="font-semibold text-ink-950">Essential details</h2>
            <Field label="Listing title" required error={errors.title}>
              <input className={inputCls(errors.title)} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. The Wexford Villa" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Street address" required error={errors.location}>
                <input className={inputCls(errors.location)} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="1802 Wexford Ridge Dr" />
              </Field>
              <Field label="City / Area" required error={errors.city}>
                <input className={inputCls(errors.city)} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Austin" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={`Price ($${form.purpose === "rent" ? "/mo" : ""})`} required error={errors.price}>
                <input type="number" min={0} className={inputCls(errors.price)} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="750000" />
              </Field>
              <Field label="Purpose">
                <select className={cn(inputCls(), "cursor-pointer appearance-none")} value={form.purpose} onChange={(e) => set("purpose", e.target.value as Purpose)}>
                  <option value="buy">For sale</option>
                  <option value="rent">For rent</option>
                </select>
              </Field>
              <Field label="Type">
                <select className={cn(inputCls(), "cursor-pointer appearance-none")} value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-4">
              <Field label="Bedrooms" error={errors.bedrooms}>
                <input type="number" min={0} className={inputCls(errors.bedrooms)} value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
              </Field>
              <Field label="Bathrooms">
                <input type="number" min={0} className={inputCls()} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
              </Field>
              <Field label="Area (sqft)" required error={errors.area}>
                <input type="number" min={0} className={inputCls(errors.area)} value={form.area} onChange={(e) => set("area", e.target.value)} />
              </Field>
              <Field label="Parking">
                <input type="number" min={0} className={inputCls()} value={form.parking} onChange={(e) => set("parking", e.target.value)} />
              </Field>
            </div>
            <Field label="Description" required error={errors.description}>
              <textarea
                rows={6}
                className={cn(inputCls(errors.description), "resize-none")}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the home honestly — layout, condition, neighborhood. Two short paragraphs read best."
              />
            </Field>
          </div>

          <div className="card space-y-5 p-6 sm:p-8">
            <h2 className="font-semibold text-ink-950">Details & coordinates</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Year built" required error={errors.yearBuilt}>
                <input type="number" className={inputCls(errors.yearBuilt)} value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} />
              </Field>
              <Field label="Latitude" error={errors.lat}>
                <input className={inputCls(errors.lat)} value={form.lat} onChange={(e) => set("lat", e.target.value)} />
              </Field>
              <Field label="Longitude">
                <input className={inputCls()} value={form.lng} onChange={(e) => set("lng", e.target.value)} />
              </Field>
            </div>
            <Field label="Amenities (comma separated)">
              <input className={inputCls()} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Pool, Smart Home, EV Charging…" />
            </Field>
            <Field label="Standout features (comma separated)">
              <input className={inputCls()} value={form.features} onChange={(e) => set("features", e.target.value)} placeholder="Open floor plan, Quartz island, 2023 roof…" />
            </Field>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="card space-y-5 p-6 sm:p-8">
            <h2 className="font-semibold text-ink-950">Publishing</h2>
            <Field label="Status">
              <select className={cn(inputCls(), "cursor-pointer appearance-none")} value={form.status} onChange={(e) => set("status", e.target.value as PropertyStatus)}>
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Listing agent" required error={errors.agentId}>
              <select className={cn(inputCls(errors.agentId), "cursor-pointer appearance-none")} value={form.agentId} onChange={(e) => set("agentId", e.target.value)}>
                <option value="">Select an agent…</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.role}
                  </option>
                ))}
              </select>
            </Field>
            <label className={toggleCls(form.verified)}>
              <input type="checkbox" className="h-4 w-4 accent-brass-600" checked={form.verified} onChange={(e) => set("verified", e.target.checked)} />
              Documents verified
            </label>
            <label className={toggleCls(form.featured)}>
              <input type="checkbox" className="h-4 w-4 accent-brass-600" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              Feature on homepage
            </label>
            <p className="flex items-start gap-2 rounded-2xl bg-cream/70 p-4 text-xs leading-relaxed text-ink-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
              Only tick "Documents verified" after title and ownership papers are confirmed. Unverified listings show an
              amber badge publicly.
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-semibold text-ink-950">
              <ImagePlus className="h-4.5 w-4.5 text-brass-600" /> Photos
              <span className="ml-auto text-xs font-medium text-ink-400">{form.images.length} selected</span>
            </h2>
            <p className="mt-1 text-xs text-ink-400">First selected photo becomes the cover.</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {IMAGE_POOL.map((img) => {
                const selected = form.images.includes(img.src);
                const order = form.images.indexOf(img.src);
                return (
                  <button
                    type="button"
                    key={img.label}
                    onClick={() => toggleImage(img.src)}
                    className={cn(
                      "group relative aspect-[4/3] overflow-hidden rounded-xl transition-all",
                      selected ? "ring-2 ring-brass-500 ring-offset-2 ring-offset-white" : "opacity-80 hover:opacity-100",
                    )}
                    aria-pressed={selected}
                    aria-label={`${img.label}${selected ? " (selected)" : ""}`}
                  >
                    <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                    {selected && (
                      <span className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-brass-500 text-[10px] font-bold text-white">
                        {order === 0 ? <Check className="h-3.5 w-3.5" /> : order + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.images && <p className="field-error mt-3">{errors.images}</p>}
          </div>

          <div className="card sticky top-6 p-6">
            <button type="submit" className="btn-brass btn-lg w-full">
              <Save className="h-4.5 w-4.5" /> {mode === "edit" ? "Save changes" : "Publish listing"}
            </button>
            <Link to="/admin/properties" className="btn-ghost btn-md mt-3 w-full">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
