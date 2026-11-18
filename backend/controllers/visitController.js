
import Property from "../models/Property.js";
import mongoose from "mongoose";
import Visit from "../models/Visit.js";

// Get All Visits (Admin)
export const getVisits = async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate("property")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User's Visits
export const getMyVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ user: req.user._id })
      .populate("property")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Visit By ID (Admin)
export const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Visit ID",
      });
    }

    const visit = await Visit.findById(id)
      .populate("property")
      .populate("user", "name email");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    res.status(200).json({
      success: true,
      visit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Visit
export const createVisit = async (req, res) => {
  try {
    const {
      property,
      name,
      email,
      phone,
      visitDate,
      visitTime,
      message,
    } = req.body;

    if (
      !property ||
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !visitDate ||
      !visitTime?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(property)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Property ID",
      });
    }

    const propertyExists = await Property.findById(property);

    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const visit = await Visit.create({
      property,
      user: req.user?._id || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      visitDate,
      visitTime: visitTime.trim(),
      message: message?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "Visit booked successfully",
      visit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Visit (Admin)
export const updateVisit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Visit ID",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "visitDate",
      "visitTime",
      "message",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const visit = await Visit.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("property")
      .populate("user", "name email");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Visit updated successfully",
      visit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Visit (Admin)
export const deleteVisit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Visit ID",
      });
    }

    const visit = await Visit.findByIdAndDelete(id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Visit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
