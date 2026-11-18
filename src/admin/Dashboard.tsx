
import { useCallback, useEffect, useState } from "react";
import {
  Home,
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TrendingUp,
  Building2,
} from "lucide-react";

import {
  getDashboardStatsAPI,
  type DashboardStats,
} from "../services/dashboardService";

const initialStats: DashboardStats = {
  totalProperties: 0,
  totalUsers: 0,
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
};

const statCards = [
  {
    key: "totalProperties",
    title: "Total Properties",
    icon: Home,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "totalUsers",
    title: "Total Users",
    icon: Users,
    color: "bg-purple-50 text-purple-600",
  },
  {
    key: "totalBookings",
    title: "Total Bookings",
    icon: CalendarDays,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "pendingBookings",
    title: "Pending Bookings",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    key: "confirmedBookings",
    title: "Confirmed Bookings",
    icon: CheckCircle2,
    color: "bg-sky-50 text-sky-600",
  },
  {
    key: "completedBookings",
    title: "Completed Bookings",
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
  {
    key: "cancelledBookings",
    title: "Cancelled Bookings",
    icon: XCircle,
    color: "bg-red-50 text-red-600",
  },
] as const;

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStatsAPI();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Dashboard statistics load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="space-y-7 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to Vista Estates Admin Panel.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Statistics
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Statistics could not be loaded</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-xs">
            Backend dashboard API aur login token check karein.
          </p>
        </div>
      )}

      {/* Main Statistics */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Website Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.key}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-900">
                      {loading ? "..." : stats[card.key]}
                    </p>
                  </div>

                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl ${card.color}`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking Summary */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Booking Summary
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading booking data...</p>
        ) : (
          <>
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-gray-500">Confirmed Bookings</span>
              <span className="font-semibold text-gray-800">
                {stats.confirmedBookings} / {stats.totalBookings}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    stats.totalBookings > 0
                      ? Math.min(
                          100,
                          (stats.confirmedBookings / stats.totalBookings) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="mt-1 text-xl font-bold text-amber-600">
                  {stats.pendingBookings}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Confirmed</p>
                <p className="mt-1 text-xl font-bold text-blue-600">
                  {stats.confirmedBookings}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="mt-1 text-xl font-bold text-green-600">
                  {stats.completedBookings}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Cancelled</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  {stats.cancelledBookings}
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
