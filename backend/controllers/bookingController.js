import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, bookingTime, address } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      bookingDate,
      bookingTime,
      address,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('service')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only admin can update booking status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update booking status' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('service')
      .populate('user', 'name email');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only admin can delete bookings
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete bookings' });
    }

    // Only allow deletion of completed bookings
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed bookings can be deleted' });
    }

    await Booking.deleteOne({ _id: booking._id });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

