import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Eye, Pencil, PlusCircle, Search, ShieldCheck, Trash2 } from "lucide-react";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import { ConfirmDialog, EmptyState } from "../components/ui";
import { formatDate, formatPrice } from "../utils/helpers";
import type { Property, PropertyStatus } from "../types";

export default function ManageProperties() {
  const { properties, updateProperty, deleteProperty, toast } = useProperties();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [toDelete, setToDelete] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    let list = [...properties].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    const query = q.trim().toLowerCase();
    if (query) list = list.filter((p) => [p.title, p.location, p.city].join(" ").toLowerCase().includes(query));
    if (status) list = list.filter((p) => p.status === status);
    if (type) list = list.filter((p) => p.propertyType === type);
    return list;
  }, [properties, q, status, type]);

  const changeStatus = (p: Property, s: PropertyStatus) => {
    updateProperty({ ...p, status: s });
    toast(`"${p.title}" marked as ${s}`, "info");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1 className="display mt-2 text-3xl font-semibold text-ink-950">Manage properties</h1>
          <p className="mt-1 text-sm text-ink-500">
            {filtered.length} of {properties.length} listings shown
          </p>
        </div>
        <Link to="/admin/properties/new" className="btn-brass btn-md">
          <PlusCircle className="h-4 w-4" /> Add property
        </Link>
      </div>

      {/* Filters */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, street or city…"
            className="input py-2.5 pl-10 text-sm"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input cursor-pointer appearance-none py-2.5 text-sm sm:w-44">
          <option value="">All statuses</option>
          {PROPERTY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input cursor-pointer appearance-none py-2.5 text-sm sm:w-44">
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-7 w-7" />}
          title="No listings match"
          message="Try a different search term, or add a new property to the portfolio."
          action={
            <Link to="/admin/properties/new" className="btn-primary btn-md mt-2">
              Add property
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/8 bg-cream/50 text-[11px] font-bold tracking-widest text-ink-500 uppercase">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Beds / Baths</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Added</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition hover:bg-cream/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img src={p.images[0]} alt="" className="h-12 w-16 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0">
                          <p className="flex max-w-56 items-center gap-1.5 truncate font-semibold text-ink-950">
                            {p.title}
                            {p.verified && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-ink-400">
                            {p.city} · {p.purpose === "rent" ? "Rental" : "Sale"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold whitespace-nowrap text-ink-900">{formatPrice(p.price, p.purpose)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-ink-600">
                      {p.bedrooms} bd · {p.bathrooms} ba
                    </td>
                    <td className="px-4 py-4 text-ink-600">{p.propertyType}</td>
                    <td className="px-4 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => changeStatus(p, e.target.value as PropertyStatus)}
                        className="input cursor-pointer appearance-none px-3 py-1.5 text-xs font-semibold"
                        aria-label={`Status for ${p.title}`}
                      >
                        {PROPERTY_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-ink-500">{formatDate(p.dateAdded)}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/properties/${p.id}`}
                          title="View live listing"
                          className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-cream hover:text-ink-950"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/properties/${p.id}/edit`}
                          title="Edit listing"
                          className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-cream hover:text-brass-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete(p)}
                          title="Delete listing"
                          className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this listing?"
        message={`"${toDelete?.title}" will be permanently removed from the public site and from visitors' saved lists. This can't be undone.`}
        confirmLabel="Delete listing"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteProperty(toDelete.id);
            toast(`"${toDelete.title}" was deleted`, "info");
          }
          setToDelete(null);
        }}
      />
    </div>
  );
}
