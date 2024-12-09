import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, LogIn, UserPlus, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import axios from 'axios'; // Ensure axios is imported

const Navigation = ({ setVisibility, setPadding }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  // Check token and update authentication state
  useEffect(() => {
    const token = localStorage.getItem('isAuthenticated');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Run only on component mount

  const checkLoginOrRegister = (path) => {
    if (path === '/login' || path === '/register') {
      setVisibility(false);
      setPadding('');
    } else {
      setVisibility(true);
      setPadding('pl-64');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.get('/api/user-logout', {}, { withCredentials: true }); // Actual logout API
      setIsAuthenticated(false);
      setVisibility(false);
      setPadding('');
      localStorage.setItem('isAuthenticated',false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="w-full bg-white shadow-sm fixed z-20 top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif text-gray-800">
            KUConnect
          </Link>

          {/* Search Bar */}
          <div className="w-full max-w-md mx-32">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors font-serif"
              />
            </div>
          </div>

          {/* Navigation Links and Profile */}
          <div className="flex items-center space-x-6">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center"
                aria-label="Profile"
              >
                <User className="h-6 w-6 text-gray-600" />
                <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                  {isAuthenticated ? (
                    <div>
                      {/* My Profile Link */}
                      <Link
                        onClick={() => {
                          checkLoginOrRegister('/myprofile');
                        }}
                        to="/myprofile"
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <UserCircle className="h-4 w-4 mr-2" /> My Profile
                      </Link>
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Login Link */}
                      <Link
                        onClick={() => {
                          checkLoginOrRegister('/login');
                        }}
                        to="/login"
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Login
                      </Link>

                      {/* Register Link */}
                      <Link
                        onClick={() => {
                          checkLoginOrRegister('/register');
                        }}
                        to="/register"
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 mr-2" /> Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
