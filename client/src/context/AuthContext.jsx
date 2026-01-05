import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { clearSubjectsCache } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const logout = () => {
  localStorage.removeItem("jwt");
  clearSubjectsCache();
  setUser(null);
  navigate("/", { replace: true });
};

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          logout(); // only now
        } else {
          // backend cold start, network glitch, etc.
          console.warn('Auth check failed, retry later');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
