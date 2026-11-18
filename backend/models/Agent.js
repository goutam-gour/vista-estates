
import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Agent email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Agent phone is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Agent role is required"],
      trim: true,
      default: "Real Estate Agent",
    },

    photo: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    },

    bio: {
      type: String,
      default:
        "Experienced luxury real estate advisor committed to finding your ideal property.",
    },

    experience: {
      type: Number,
      default: 5,
    },

    rating: {
      type: Number,
      default: 4.9,
    },

    licenseNumber: {
      type: String,
      default: "RE-784920",
    },

    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
