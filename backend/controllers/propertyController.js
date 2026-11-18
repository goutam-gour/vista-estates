
import mongoose from "mongoose";
import Property from "../models/Property.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Convert FormData JSON strings into arrays
const parseArray = (value) => {
  if (Array.isArray(value)) return value;

  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Convert FormData boolean strings into booleans
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return value === true || value === "true";
};

// Build property data from request body
const getPropertyData = (body) => {
  const data = {};

  const stringFields = [
    "title",
    "description",
    "location",
    "city",
    "state",
    "propertyType",
    "purpose",
    "status",
  ];

  stringFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  const numberFields = [
    "price",
    "bedrooms",
    "bathrooms",
    "area",
    "parking",
    "yearBuilt",
    "lat",
    "lng",
  ];

  numberFields.forEach((field) => {
    if (body[field] !== undefined && body[field] !== "") {
      data[field] = Number(body[field]);
    }
  });

  if (body.amenities !== undefined) {
    data.amenities = parseArray(body.amenities);
  }

  if (body.features !== undefined) {
    data.features = parseArray(body.features);
  }

  if (body.verified !== undefined) {
    data.verified = parseBoolean(body.verified);
  }

  if (body.featured !== undefined) {
    data.featured = parseBoolean(body.featured);
  }

  if (body.agent !== undefined) {
    if (body.agent === "") {
      data.agent = null;
    } else if (mongoose.Types.ObjectId.isValid(body.agent)) {
      data.agent = body.agent;
    }
  }

  return data;
};

// Upload received files to Cloudinary
const uploadPropertyImages = async (files = []) => {
  const imageUrls = [];

  for (const file of files) {
    const imageUrl = await uploadToCloudinary(
      file.path,
      "properties"
    );

    imageUrls.push(imageUrl);
  }

  return imageUrls;
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("agent")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id).populate("agent");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Protected
export const createProperty = async (req, res) => {
  try {
    const propertyData = getPropertyData(req.body);

    // Upload selected images to Cloudinary
    const uploadedImages = await uploadPropertyImages(req.files);

    // Combine any retained images with newly uploaded images
    const keepImages = parseArray(req.body.keepImages);

    const images = [
      ...new Set([...keepImages, ...uploadedImages]),
    ];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one property image",
      });
    }

    const property = await Property.create({
      ...propertyData,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Protected
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const updateData = getPropertyData(req.body);

    // Only allow images that already belong to this property
    const requestedImages = parseArray(req.body.keepImages);

    const retainedImages = (property.images || []).filter((image) =>
      requestedImages.includes(image)
    );

    // Upload newly selected images
    const uploadedImages = await uploadPropertyImages(req.files);

    const finalImages = [
      ...new Set([...retainedImages, ...uploadedImages]),
    ];

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please keep or add at least one property image",
      });
    }

    updateData.images = finalImages;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("agent");

    // Delete only old images that were removed
    const removedImages = (property.images || []).filter(
      (image) => !finalImages.includes(image)
    );

    for (const image of removedImages) {
      await deleteFromCloudinary(image);
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Protected
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await Property.findByIdAndDelete(id);

    // Delete associated Cloudinary images
    for (const image of property.images || []) {
      await deleteFromCloudinary(image);
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
