
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Property description is required"],
    },

    price: {
      type: Number,
      required: [true, "Property price is required"],
      min: [0, "Price must be a positive number"],
    },

    location: {
      type: String,
      required: [true, "Property location / address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },

    state: {
      type: String,
      default: "TX",
      trim: true,
    },

    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: [
        "Apartment",
        "Villa",
        "House",
        "Plot",
        "Commercial",
        "Office",
        "Shop",
        "Penthouse",
        "Loft",
        "Estate",
        "Townhouse",
      ],
      index: true,
    },

    purpose: {
      type: String,
      required: true,
      enum: ["Buy", "Rent"],
      default: "Buy",
      index: true,
    },

    bedrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    area: {
      type: Number,
      required: [true, "Property area is required"],
      min: 1,
    },

    parking: {
      type: Number,
      default: 1,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      required: [true, "At least one property image is required"],
      validate: {
        validator: (images) => images.length > 0,
        message: "At least one property image is required",
      },
    },

    lat: {
      type: Number,
      default: 0,
    },

    lng: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Pending", "Sold", "Rented"],
      default: "Available",
      index: true,
    },

    verified: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    yearBuilt: {
      type: Number,
      default: 2022,
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },

    reports: [
      {
        reason: { type: String, required: true },
        details: { type: String },
        reporterEmail: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Automatically generate slug before saving
propertySchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now().toString().slice(-4);
  }

  next();
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
