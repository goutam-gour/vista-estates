
import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";

import {
  getVisits,
  getMyVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
} from "../controllers/visitController.js";

import {
  protect,
  optionalAuth,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// User: Get only their own bookings
// Keep this route before /:id
router.get("/my", protect, getMyVisits);

// Admin: Get all bookings
router.get("/", protect, adminOnly, getVisits);

// Admin: Get one booking
router.get("/:id", protect, adminOnly, getVisitById);

// Create booking (login optional)
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

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone is required"),

    body("visitDate")
      .notEmpty()
      .withMessage("Visit date is required"),

    body("visitTime")
      .trim()
      .notEmpty()
      .withMessage("Visit time is required"),
  ]),
  createVisit
);

// Admin: Update booking status
router.put("/:id", protect, adminOnly, updateVisit);

// Admin: Delete booking
router.delete("/:id", protect, adminOnly, deleteVisit);

export default router;
