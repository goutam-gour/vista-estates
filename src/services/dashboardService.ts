
const API_URL = "http://localhost:5000/api";

export interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export async function getDashboardStatsAPI(): Promise<DashboardStats> {
  const token =
    localStorage.getItem("vista_token") ||
    sessionStorage.getItem("vista_token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(`${API_URL}/dashboard/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to load dashboard statistics.");
  }

  const data = result.stats || result.data || result;

  return {
    totalProperties: Number(data.totalProperties ?? data.propertyCount ?? 0),
    totalUsers: Number(data.totalUsers ?? data.userCount ?? 0),
    totalBookings: Number(
      data.totalBookings ?? data.totalVisits ?? data.visitCount ?? 0
    ),
    pendingBookings: Number(
      data.pendingBookings ?? data.pendingVisits ?? 0
    ),
    confirmedBookings: Number(
      data.confirmedBookings ?? data.confirmedVisits ?? 0
    ),
    completedBookings: Number(
      data.completedBookings ?? data.completedVisits ?? 0
    ),
    cancelledBookings: Number(
      data.cancelledBookings ?? data.cancelledVisits ?? 0
    ),
  };
}
