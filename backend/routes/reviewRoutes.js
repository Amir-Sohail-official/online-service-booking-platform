import express from "express";
import {
  createReview,
  getReviews,
  getReviewByBooking,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * PUBLIC
 * Anyone can see reviews on services page
 */
router.get("/", getReviews);

/**
 * PROTECTED
 * Only logged-in users can create/delete reviews
 */
router.post("/", protect, createReview);
router.get("/booking/:bookingId", protect, getReviewByBooking);
router.delete("/:id", protect, deleteReview);

export default router;
