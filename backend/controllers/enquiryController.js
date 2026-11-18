import mongoose from "mongoose";
import Enquiry from "../models/Enquiry.js";

// 1. Get All Enquiries
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("property")
      .populate("user");

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Get Enquiry By ID
export const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Enquiry ID",
      });
    }

    const enquiry = await Enquiry.findById(id)
      .populate("property")
      .populate("user");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Create Enquiry
export const createEnquiry = async (req, res) => {
  try {
    const { property, name, email, phone, message } = req.body;

    if (!property || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Property, name, email and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(property)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Property ID",
      });
    }

    const enquiry = await Enquiry.create({
      property,
      user: req.user?._id || null,
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Update Enquiry
export const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Enquiry ID",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Delete Enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Enquiry ID",
      });
    }

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};