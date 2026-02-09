import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import api from "./utils/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

            {/* PUBLIC SERVICES PAGE */}
            <Route path="/" element={<Services user={user} />} />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/" />
                  )
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={
                user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
              }
            />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  user.role === "admin" ? (
                    <AdminDashboard user={user} />
                  ) : (
                    <UserDashboard user={user} />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
