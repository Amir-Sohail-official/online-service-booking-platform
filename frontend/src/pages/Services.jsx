import { useState, useEffect } from 'react';
import api from '../utils/api';

const Services = ({ user }) => {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    bookingTime: '',
    address: '',
  });

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const getServiceReviews = (serviceId) => {
    return reviews.filter((review) => review.service?._id === serviceId);
  };

  const getAverageRating = (serviceId) => {
    const serviceReviews = getServiceReviews(serviceId);
    if (serviceReviews.length === 0) return 0;
    const sum = serviceReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / serviceReviews.length).toFixed(1);
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceDetailModal(true);
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        alert('Review deleted successfully!');
        fetchReviews(); // Refresh reviews
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', {
        serviceId: selectedService._id,
        ...bookingData,
      });
      alert('Booking created successfully!');
      setShowBookingModal(false);
      setBookingData({ bookingDate: '', bookingTime: '', address: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Services</h1>
          <p className="text-gray-600">Browse and book from our wide range of professional services</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const serviceReviews = getServiceReviews(service._id);
            const averageRating = getAverageRating(service._id);
            
            return (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full border border-gray-100"
                onClick={() => handleServiceClick(service)}
              >
                {/* Header Section */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight pr-2">{service.name}</h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">
                      {service.category}
                    </span>
                  </div>
                  
                  {/* Description with fixed height */}
                  <div className="h-20 mb-4 overflow-hidden">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Reviews Section */}
                  {serviceReviews.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.round(parseFloat(averageRating))
                                  ? 'text-yellow-400 text-sm'
                                  : 'text-gray-300 text-sm'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {averageRating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({serviceReviews.length} {serviceReviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                      {serviceReviews.slice(0, 1).map((review) => (
                        <div key={review._id} className="text-xs text-gray-600">
                          <span className="font-semibold text-gray-800">"{review.comment.length > 50
                            ? `${review.comment.substring(0, 50)}..."`
                            : `"${review.comment}"`}</span>
                          <span className="text-gray-500 ml-1">- {review.user?.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Section - Always at bottom */}
                <div className="mt-auto p-6 pt-0 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        ${service.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        / {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookService(service);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {showServiceDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedService.name}</h2>
                  <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                    {selectedService.category}
                  </span>
                </div>
                <button
                  onClick={() => setShowServiceDetailModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors w-10 h-10 flex items-center justify-center"
                >
                  <span className="text-2xl font-bold">×</span>
                </button>
              </div>
            </div>
            
            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">
                      ${selectedService.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      for {selectedService.duration} {selectedService.duration === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowServiceDetailModal(false);
                      handleBookService(selectedService);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    Book Now
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
                {(() => {
                  const serviceReviews = getServiceReviews(selectedService._id);
                  const avgRating = getAverageRating(selectedService._id);
                  
                  if (serviceReviews.length === 0) {
                    return (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <div className="text-4xl mb-2">⭐</div>
                        <p className="text-gray-600 font-medium">
                          No reviews yet. Be the first to review this service!
                        </p>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < Math.round(parseFloat(avgRating))
                                    ? 'text-yellow-400 text-2xl'
                                    : 'text-gray-300 text-2xl'
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              {avgRating}
                            </span>
                            <span className="text-gray-600 ml-1">out of 5</span>
                            <span className="text-gray-500 text-sm ml-2">
                              ({serviceReviews.length} {serviceReviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {serviceReviews.map((review) => (
                          <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-900 block">
                                    {review.user?.name}
                                  </span>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={
                                          i < review.rating
                                            ? 'text-yellow-400 text-sm'
                                            : 'text-gray-300 text-sm'
                                        }
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {user && review.user?._id === user._id && (
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h2 className="text-2xl font-bold">
                Book {selectedService?.name}
              </h2>
              <p className="text-blue-100 text-sm mt-1">Fill in the details to complete your booking</p>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Booking Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  value={bookingData.bookingDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, bookingDate: e.target.value })
                  }
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏰ Time
                </label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  value={bookingData.bookingTime}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, bookingTime: e.target.value })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Service Address
                </label>
                <textarea
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  rows="3"
                  placeholder="Enter the address where service is needed"
                  value={bookingData.address}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, address: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all font-semibold"
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

export default Services;




