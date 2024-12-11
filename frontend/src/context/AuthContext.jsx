// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('JWT_TOKEN');
    if (token) {
      setIsAuthenticated(true); // User is authenticated if token is present
    } else {
      setIsAuthenticated(false); // User is not authenticated
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    Cookies.remove('JWT_TOKEN');
    Cookies.remove('REFRESH_TOKEN');
    setIsAuthenticated(false);

    try {
      await axios.post('/user-logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
