
import Property from "../models/Property.js";
import User from "../models/User.js";
import Visit from "../models/Visit.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProperties,
      totalUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments({ role: { $ne: "admin" } }),
      Visit.countDocuments(),
      Visit.countDocuments({ status: "Pending" }),
      Visit.countDocuments({ status: "Confirmed" }),
      Visit.countDocuments({ status: "Completed" }),
      Visit.countDocuments({ status: "Cancelled" }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to load dashboard statistics.",
    });
  }
};
