import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = await Review.create({
      user: req.user._id,
      service: booking.service,
      booking: bookingId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('service', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { serviceId } = req.query;
    const query = serviceId ? { service: serviceId } : {};
    
    const reviews = await Review.find(query)
      .populate('user', 'name _id')
      .populate('service', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const review = await Review.findOne({ booking: bookingId })
      .populate('user', 'name')
      .populate('service', 'name');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Admin can delete any review, users can only delete their own
    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: review._id });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




