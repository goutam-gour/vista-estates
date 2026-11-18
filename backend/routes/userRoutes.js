
import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected for Admin
router.use(protect, adminOnly);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
