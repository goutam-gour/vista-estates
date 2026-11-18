
import express from "express";
import { body } from "express-validator";

import { validate } from "../middleware/validationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public Routes */

// Anyone can view all properties
router.get("/", getProperties);

// Anyone can view a single property
router.get("/:id", getPropertyById);

/* Admin Only Routes */

// Create Property
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  validate([
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Property title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("price")
      .isFloat({ min: 1 })
      .withMessage("Price must be greater than 0"),

    body("city")
      .trim()
      .notEmpty()
      .withMessage("City is required"),
  ]),
  createProperty
);

// Update Property
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  validate([
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Property title is required"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("price")
      .optional()
      .isFloat({ min: 1 })
      .withMessage("Price must be greater than 0"),

    body("city")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("City is required"),
  ]),
  updateProperty
);

// Delete Property
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProperty
);

export default router;
