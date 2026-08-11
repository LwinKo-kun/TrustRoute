import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/user')
        .then((response) => {
          const userData = response.data?.user ?? response.data;
          setUser(userData);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const authToken = response.data.access_token || response.data.token;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (name, email, password, role = 'customer') => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: password, // Laravel Validation အတွက် ထည့်သွင်းထားသည်
      role,
    });

    const authToken = response.data.access_token || response.data.token;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);