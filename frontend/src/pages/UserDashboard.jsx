import { useState, useEffect } from 'react';
import api from '../utils/api';

const UserDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      const bookingsData = response.data;
      
      // Check for existing reviews for each booking
      const bookingsWithReviews = await Promise.all(
        bookingsData.map(async (booking) => {
          try {
            const reviewResponse = await api.get(`/reviews/booking/${booking._id}`);
            return { ...booking, existingReview: reviewResponse.data };
          } catch (error) {
            // No review exists for this booking
            return { ...booking, existingReview: null };
          }
        })
      );
      
      setBookings(bookingsWithReviews);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAddReview = (booking) => {
    if (booking.status === 'completed' && !booking.existingReview) {
      setSelectedBooking(booking);
      setReviewData({ rating: 5, comment: '' });
      setReviewError('');
      setShowReviewModal(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmittingReview(true);
    
    try {
      await api.post('/reviews', {
        bookingId: selectedBooking._id,
        ...reviewData,
      });
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      setSelectedBooking(null);
      fetchBookings(); // Refresh bookings to update review status
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to add review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        alert('Review deleted successfully!');
        fetchBookings(); // Refresh bookings to update review status
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <p className="text-gray-600 mb-8">Welcome, {user.name}! Manage your service bookings here.</p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings yet.</p>
            <p className="text-gray-400 text-sm mt-2">Book a service to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  booking.status === 'completed' && !booking.existingReview
                    ? 'border-2 border-green-200'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {booking.service?.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 {new Date(booking.bookingDate).toLocaleDateString()} at ⏰ {booking.bookingTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">📍 {booking.address}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                
                {/* Review Section */}
                {booking.status === 'completed' ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {booking.existingReview ? (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-green-800 flex items-center">
                            ✓ Review Submitted
                          </p>
                          <button
                            onClick={() => handleDeleteReview(booking.existingReview._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < booking.existingReview.rating
                                  ? 'text-yellow-400 text-lg'
                                  : 'text-gray-300 text-lg'
                              }
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({booking.existingReview.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{booking.existingReview.comment}"</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800 mb-3">
                          ⭐ This service is completed! Share your experience with others.
                        </p>
                        <button
                          onClick={() => handleAddReview(booking)}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Add Review
                        </button>
                      </div>
                    )}
                  </div>
                ) : booking.status === 'pending' ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      ⏳ Waiting for provider approval. You can submit a review once the service is completed.
                    </p>
                  </div>
                ) : booking.status === 'approved' ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      ✅ Booking approved! After the service is completed, you'll be able to submit a review.
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>


      {showReviewModal && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReviewModal(false);
              setReviewError('');
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add Review</h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewError('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Service:</p>
              <p className="text-lg font-semibold">{selectedBooking.service?.name}</p>
            </div>
            
            <form onSubmit={handleReviewSubmit}>
              {reviewError && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {reviewError}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className={`text-3xl transition-colors ${
                          star <= reviewData.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {reviewData.rating} {reviewData.rating === 1 ? 'star' : 'stars'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  minLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Share your experience with this service..."
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewData.comment.length} characters (minimum 10)
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submittingReview || reviewData.comment.length < 10}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewError('');
                  }}
                  disabled={submittingReview}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;




