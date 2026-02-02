import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import api from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Verify user data from backend
          const response = await api.get('/auth/me');
          const currentUser = response.data;
          console.log('Current user from backend:', currentUser);
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          console.error('Error verifying user:', error);
          // Fallback to stored user data
          const parsedUser = JSON.parse(userData);
          console.log('Using stored user data:', parsedUser);
          setUser(parsedUser);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/login"
              element={user ? (user.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/" />) : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? (user.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/" />) : <Register onLogin={handleLogin} />}
            />
            <Route
              path="/"
              element={
                user ? (
                  user.role === 'admin' ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Services user={user} />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  user.role === 'admin' ? (
                    <AdminDashboard user={user} />
                  ) : (
                    <UserDashboard user={user} />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;




