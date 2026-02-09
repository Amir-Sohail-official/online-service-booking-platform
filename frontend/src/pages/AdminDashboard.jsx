import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  // Verify user is admin
  useEffect(() => {
    console.log('AdminDashboard - User prop:', user);
    console.log('AdminDashboard - User role:', user?.role);
    if (user && user.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      console.error('❌ User role is not admin:', user.role);
      console.error('❌ Full user data:', user);
    } else if (user && user.role === 'admin') {
      console.log('✅ Admin access confirmed');
    }
  }, [user]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersRes, servicesRes, bookingsRes, reviewsRes] = await Promise.all([
        api.get('/users/all'),
        api.get('/services'),
        api.get('/bookings/all'),
        api.get('/reviews'),
      ]);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
      setBookings(bookingsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Statistics calculations
  const stats = {
    totalUsers: users.filter(u => u.role === 'user').length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    totalServices: services.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    approvedBookings: bookings.filter(b => b.status === 'approved').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, serviceData);
      } else {
        await api.post('/services', serviceData);
      }
      setShowServiceModal(false);
      setEditingService(null);
      setServiceData({ name: '', description: '', price: '', duration: '', category: '' });
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        fetchAllData();
      } catch (error) {
        alert('Failed to delete service');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchAllData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        fetchAllData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this completed booking? This action cannot be undone.')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        fetchAllData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-600 mb-4">
            {error || 'You do not have admin privileges to access this page.'}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Current role: {user?.role || 'Not logged in'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                👑 Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Welcome, <span className="font-semibold">{user.name}</span>!</p>
              <p className="text-sm text-gray-500 mt-1">
                Role: <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">{user.role}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <p className="text-green-800 font-bold text-lg">ADMIN MODE</p>
                <p className="text-green-600 text-sm">Full System Access</p>
              </div>
            </div>
          </div>
        </div>

      <div className="flex gap-4 mb-6 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === 'services'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🛠️ Services
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📅 Bookings
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ⭐ Reviews
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Admins</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalAdmins}</p>
                </div>
                <div className="text-4xl">👑</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Services</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalServices}</p>
                </div>
                <div className="text-4xl">🛠️</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalBookings}</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    {stats.pendingBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approved</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {stats.approvedBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {stats.completedBookings}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Reviews</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    {stats.totalReviews}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    {stats.averageRating} ⭐
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Services Management</h2>
            <button
              onClick={() => {
                setEditingService(null);
                setServiceData({ name: '', description: '', price: '', duration: '', category: '' });
                setShowServiceModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Service
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-2 text-sm">{service.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  ${service.price} • {service.duration} hours • {service.category}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditService(service)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{booking.service?.name}</h3>
                    <p className="text-gray-600 mt-1">
                      👤 User: {booking.user?.name} ({booking.user?.email})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 {new Date(booking.bookingDate).toLocaleDateString()} at ⏰ {booking.bookingTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">📍 {booking.address}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                    </select>
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        disabled={u._id === user._id}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u._id !== user._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{review.user?.name}</h3>
                    <p className="text-gray-600">{review.service?.name}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingService ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleServiceSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={serviceData.name}
                    onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                    value={serviceData.description}
                    onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={serviceData.price}
                    onChange={(e) => setServiceData({ ...serviceData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={serviceData.duration}
                    onChange={(e) => setServiceData({ ...serviceData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={serviceData.category}
                    onChange={(e) => setServiceData({ ...serviceData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
