
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/", protect, getFavorites);
router.post("/:propertyId", protect, addFavorite);
router.delete("/:propertyId", protect, removeFavorite);

export default router;
