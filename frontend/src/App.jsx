import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Services = ({ user }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    bookingDate: "",
    bookingTime: "",
    address: "",
  });

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get("/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        alert("Review deleted successfully!");
        fetchReviews(); // Refresh reviews
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete review");
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bookings", {
        serviceId: selectedService._id,
        ...bookingData,
      });
      alert("Booking created successfully!");
      setShowBookingModal(false);
      setBookingData({ bookingDate: "", bookingTime: "", address: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create booking");
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Services
          </h1>
          <p className="text-gray-600">
            Browse and book from our wide range of professional services
          </p>
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
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight pr-2">
                      {service.name}
                    </h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">
                      {service.category}
                    </span>
                  </div>
                  <div className="h-20 mb-4 overflow-hidden">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  {serviceReviews.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.round(parseFloat(averageRating))
                                  ? "text-yellow-400 text-sm"
                                  : "text-gray-300 text-sm"
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
                          ({serviceReviews.length}{" "}
                          {serviceReviews.length === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                      {serviceReviews.slice(0, 1).map((review) => (
                        <div key={review._id} className="text-xs text-gray-600">
                          <span className="font-semibold text-gray-800">
                            "
                            {review.comment.length > 50
                              ? `${review.comment.substring(0, 50)}...`
                              : review.comment}
                            "
                          </span>
                          <span className="text-gray-500 ml-1">
                            - {review.user?.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-auto p-6 pt-0 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        ${service.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        / {service.duration}{" "}
                        {service.duration === 1 ? "hour" : "hours"}
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
    </div>
  );
};

export default Services;
