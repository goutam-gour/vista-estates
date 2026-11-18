
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  User,
  Building2,
  Trash2,
} from "lucide-react";

import {
  getVisitsAPI,
  updateVisitAPI,
  deleteVisitAPI,
  type Visit,
} from "../../services/visitService";

type BookingStatus = Visit["status"];

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function ManageVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const loadVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getVisitsAPI();
      setVisits(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bookings load nahi ho sakin."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  // Update booking status
  const changeStatus = async (
    id: string,
    status: BookingStatus
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      await updateVisitAPI(id, status);

      setVisits((current) =>
        current.map((visit) =>
          visit._id === id ? { ...visit, status } : visit
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update nahi hua."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete booking permanently from MongoDB
  const deleteBooking = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this booking? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteVisitAPI(id);

      setVisits((current) =>
        current.filter((visit) => visit._id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Booking delete nahi hui."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Search and filter bookings
  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const property =
        typeof visit.property === "object" ? visit.property : null;

      const searchText = [
        visit.name,
        visit.email,
        visit.phone,
        property?.title || "",
        property?.location || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus = filter === "All" || visit.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [visits, search, filter]);

  // Booking statistics
  const counts = {
    total: visits.length,
    pending: visits.filter((v) => v.status === "Pending").length,
    confirmed: visits.filter((v) => v.status === "Confirmed").length,
    completed: visits.filter((v) => v.status === "Completed").length,
    cancelled: visits.filter((v) => v.status === "Cancelled").length,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Property visit bookings ko manage karein.
          </p>
        </div>

        <button
          onClick={loadVisits}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Total", value: counts.total, color: "text-gray-900" },
          { label: "Pending", value: counts.pending, color: "text-amber-600" },
          { label: "Confirmed", value: counts.confirmed, color: "text-blue-600" },
          { label: "Completed", value: counts.completed, color: "text-green-600" },
          { label: "Cancelled", value: counts.cancelled, color: "text-red-600" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-2 text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or property..."
            className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="All">All Bookings</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Booking List */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Loading bookings...
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <CalendarDays
            className="mx-auto mb-3 text-gray-400"
            size={36}
          />

          <h3 className="font-semibold text-gray-800">
            No bookings found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Abhi is filter ke liye koi booking available nahi hai.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit) => {
            const property =
              typeof visit.property === "object" ? visit.property : null;

            return (
              <div
                key={visit._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {/* Booking Header */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {property?.title || "Property Visit"}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[visit.status]}`}
                      >
                        {visit.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Booking ID: {visit._id}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">

                    {visit.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            changeStatus(visit._id, "Confirmed")
                          }
                          disabled={
                            updatingId === visit._id ||
                            deletingId === visit._id
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          Confirm
                        </button>

                        <button
                          onClick={() =>
                            changeStatus(visit._id, "Cancelled")
                          }
                          disabled={
                            updatingId === visit._id ||
                            deletingId === visit._id
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      </>
                    )}

                    {visit.status === "Confirmed" && (
                      <>
                        <button
                          onClick={() =>
                            changeStatus(visit._id, "Completed")
                          }
                          disabled={
                            updatingId === visit._id ||
                            deletingId === visit._id
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          Complete
                        </button>

                        <button
                          onClick={() =>
                            changeStatus(visit._id, "Cancelled")
                          }
                          disabled={
                            updatingId === visit._id ||
                            deletingId === visit._id
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      </>
                    )}

                    {updatingId === visit._id && (
                      <span className="self-center text-xs text-gray-500">
                        Updating...
                      </span>
                    )}

                    {/* Delete Booking */}
                    <button
                      onClick={() => deleteBooking(visit._id)}
                      disabled={
                        deletingId === visit._id ||
                        updatingId === visit._id
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingId === visit._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Customer and Property Details */}
                <div className="mt-5 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">

                  <div className="flex items-start gap-2 text-sm">
                    <User size={17} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Customer</p>
                      <p className="font-medium text-gray-800">
                        {visit.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Mail size={17} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="break-all font-medium text-gray-800">
                        {visit.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Phone size={17} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="font-medium text-gray-800">
                        {visit.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <CalendarDays size={17} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Visit Date</p>
                      <p className="font-medium text-gray-800">
                        {visit.visitDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Clock size={17} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Visit Time</p>
                      <p className="font-medium text-gray-800">
                        {visit.visitTime}
                      </p>
                    </div>
                  </div>

                  {property?.location && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={17} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="font-medium text-gray-800">
                          {property.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {!property && (
                    <div className="flex items-start gap-2 text-sm">
                      <Building2 size={17} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Property ID</p>
                        <p className="font-medium text-gray-800">
                          {String(visit.property)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Message */}
                {visit.message && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">
                      Customer Message
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {visit.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
