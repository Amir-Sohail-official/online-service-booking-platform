import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">
                Service Booking
              </span>
              <span className="text-xs text-blue-200 leading-tight">
                Professional Services
              </span>
            </div>
          </Link>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen
                      ? "M6 18L18 6M6 6l12 12" // X icon
                      : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                  }
                />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/"
                  className="hover:text-blue-200 transition-colors font-medium flex items-center gap-1"
                >
                  Services
                </Link>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-200 transition-colors font-medium flex items-center gap-1"
                >
                  {user.role === "admin" ? "Dashboard" : "My Bookings"}
                </Link>
                <div className="flex items-center gap-3 pl-3 border-l border-blue-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      {user.role === "admin" && (
                        <span className="text-xs text-yellow-300 font-semibold">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-2">
          {user ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-200 transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-200 transition-colors font-medium"
              >
                {user.role === "admin" ? "Dashboard" : "My Bookings"}
              </Link>
              <div className="flex items-center gap-2 mt-2 border-t border-blue-500 pt-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.role === "admin" && (
                    <span className="text-xs text-yellow-300 font-semibold">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 mt-2 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-200 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
