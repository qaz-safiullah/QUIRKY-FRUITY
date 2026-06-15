import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile, forgotPassword, resetPassword as apiResetPassword } from '../services/api';

const AuthContext = createContext();

function loadUser() {
  try {
    const saved = localStorage.getItem('qf-user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function loadToken() {
  return localStorage.getItem('qf-token') || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [token, setToken] = useState(loadToken);

  useEffect(() => {
    if (token) {
      localStorage.setItem('qf-token', token);
    } else {
      localStorage.removeItem('qf-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('qf-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qf-user');
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch {
      logout();
    }
  }, [logout]);

  const handleForgotPassword = useCallback(async (email) => {
    return forgotPassword({ email });
  }, []);

  const handleResetPassword = useCallback(async (email, password) => {
    return apiResetPassword({ email, password });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, refreshUser, handleForgotPassword, handleResetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
