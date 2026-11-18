import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";

import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../controllers/agentController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all agents
router.get("/", getAgents);

// Get agent by ID
router.get("/:id", getAgentById);

// Create agent
router.post(
  "/",
  protect,
  adminOnly,
  validate([
    body("name").trim().notEmpty().withMessage("Agent name is required"),
    body("email").trim().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("phone").trim().notEmpty().withMessage("Phone is required")
  ]),
  createAgent
);
// Update agent
router.put("/:id", protect, adminOnly, updateAgent);

// Delete agent
router.delete("/:id", protect, adminOnly, deleteAgent);

export default router;