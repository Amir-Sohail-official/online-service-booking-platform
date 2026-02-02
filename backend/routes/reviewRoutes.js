import express from 'express';
import {
  createReview,
  getReviews,
  getReviewByBooking,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', protect, getReviews);
router.get('/booking/:bookingId', protect, getReviewByBooking);
router.delete('/:id', protect, deleteReview);

export default router;




