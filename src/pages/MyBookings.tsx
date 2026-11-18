
import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import { useProperties } from "../context/PropertyContext";
import {
  getMyVisitsAPI,
  type Visit,
} from "../services/visitService";

/* Format visit date */
function formatDate(value: string) {
  if (!value) return "Date not available";

  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/* Booking status styles */
function getStatusStyle(status: Visit["status"]) {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";

    case "Completed":
      return "bg-blue-100 text-blue-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function MyBookings() {
  const { user } = useProperties();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Load logged-in user's bookings */
  const loadBookings = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      const data = await getMyVisitsAPI();

      setVisits(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, loadBookings]);

  /* Login required */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="min-h-screen bg-cream/40 py-12 sm:py-16">
      <div className="container-x mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-brass-600">
              Your property visits
            </p>

            <h1 className="display mt-3 text-3xl font-semibold text-ink-950 sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              View and manage your scheduled property visits.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            className="btn-outline btn-md"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-700">
              Booking could not be loaded
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadBookings}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visits.length === 0 && (
          <div className="rounded-3xl border border-ink-900/10 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cream text-brass-600">
              <ClipboardList className="h-8 w-8" />
            </div>

            <h2 className="display mt-6 text-2xl font-semibold text-ink-950">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
              You haven't scheduled any property visits yet.
              Explore our properties and book a private tour.
            </p>

            <Link
              to="/properties"
              className="btn-brass btn-md mt-7 inline-flex"
            >
              Explore Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Booking List */}
        {!loading && !error && visits.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink-600">
                {visits.length}{" "}
                {visits.length === 1 ? "booking" : "bookings"} found
              </p>
            </div>

            {visits.map((visit) => {
              const property =
                typeof visit.property === "object" &&
                visit.property !== null
                  ? visit.property
                  : null;

              const propertyId = property?._id ||
                (typeof visit.property === "string"
                  ? visit.property
                  : "");

              const propertyTitle =
                property?.title || "Property Visit";

              const propertyImage = property?.images?.[0];

              return (
                <article
                  key={visit._id}
                  className="overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-sm"
                >
                  <div className="grid md:grid-cols-[230px_1fr]">

                    {/* Property Image */}
                    <div className="h-52 bg-cream md:h-full">
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt={propertyTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-48 items-center justify-center text-brass-600">
                          <Building2 className="h-14 w-14" />
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold tracking-widest text-brass-600 uppercase">
                            Property Visit
                          </p>

                          <h2 className="display mt-2 text-xl font-semibold text-ink-950 sm:text-2xl">
                            {propertyTitle}
                          </h2>

                          {property?.location && (
                            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
                              <MapPin className="h-4 w-4" />
                              {property.location}
                            </p>
                          )}
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(visit.status)}`}
                        >
                          {visit.status}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-brass-700">
                            <CalendarDays className="h-5 w-5" />
                          </span>

                          <div>
                            <p className="text-xs text-ink-400">
                              Visit Date
                            </p>
                            <p className="text-sm font-semibold text-ink-900">
                              {formatDate(visit.visitDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-brass-700">
                            <Clock3 className="h-5 w-5" />
                          </span>

                          <div>
                            <p className="text-xs text-ink-400">
                              Visit Time
                            </p>
                            <p className="text-sm font-semibold text-ink-900">
                              {visit.visitTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/10 pt-5">
                        <p className="text-xs text-ink-400">
                          Booking ID:{" "}
                          <span className="font-semibold text-ink-700">
                            {visit._id.slice(-8).toUpperCase()}
                          </span>
                        </p>

                        {propertyId && (
                          <Link
                            to={`/properties/${propertyId}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-brass-700 hover:text-brass-800"
                          >
                            View Property
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
