
import mongoose from "mongoose";
import User from "../models/User.js";
import Property from "../models/Property.js";

// Get logged-in user's favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      model: "Property",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add property to favorites
export const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: property._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove property from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: propertyId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
