import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";

import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController.js";

import {
  protect,
  optionalAuth,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all enquiries
router.get("/", protect, adminOnly, getEnquiries);

// Get enquiry by ID
router.get("/:id", protect, adminOnly, getEnquiryById);

// Create enquiry (login optional)
router.post(
  "/",
  optionalAuth,
  validate([
    body("property")
      .notEmpty()
      .withMessage("Property ID is required"),

    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
  ]),
  createEnquiry
);

// Update enquiry
router.put("/:id", protect, adminOnly, updateEnquiry);

// Delete enquiry
router.delete("/:id", protect, adminOnly, deleteEnquiry);

export default router;