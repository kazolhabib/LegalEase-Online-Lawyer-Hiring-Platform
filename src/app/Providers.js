'use strict';

'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';

// Theme Context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function CustomThemeProvider({ children }) {
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
    queueMicrotask(() => setTheme(initialTheme));
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  // Prevent flash by waiting for the browser theme to be resolved.
  if (!mounted || !theme) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Auth Context
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  googleLogin: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  updateRole: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (err) {
          console.error('Failed to verify token:', err);
          // Don't log out on network loss, but keep local user if possible
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const googleLogin = async (idToken) => {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Google login failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return { user: data.user, isNewUser: data.isNewUser };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (name, avatar) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, avatar })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to update profile');
    }

    // Update local storage user data keeping other fields
    const updatedUser = { ...user, name: data.name, avatar: data.avatar };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const updateRole = async (role) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to update role');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateProfile, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// Global Providers Component
export default function Providers({ children }) {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </CustomThemeProvider>
  );
}
