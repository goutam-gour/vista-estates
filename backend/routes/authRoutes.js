
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  validate([
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ]),
  registerUser
);

// Login
router.post(
  "/login",
  validate([
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ]),
  loginUser
);

// Get logged-in user profile
router.get("/me", protect, getMe);

// Update logged-in user profile
router.put("/me", protect, updateMe);

// Change Password
router.put(
  "/change-password",
  protect,
  validate([
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),

    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
  ]),
  changePassword
);
// Demo Forgot Password
router.post(
  "/forgot-password",
  validate([
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ]),
  forgotPassword
);

export default router;
