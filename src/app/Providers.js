'use strict';

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

function CustomThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.add(initialTheme);
    }
    setMounted(true);
  }, []);

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

  // Prevent flash by waiting for mount
  if (!mounted) {
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
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role = 'user') => {
    let mockUser = {
      name: 'Kazi Habib',
      email: 'kazi.habib@gmail.com',
      role: 'user', // default client
      avatar: 'https://i.ibb.co.com/8gN0h4R/user-avatar.png'
    };

    if (role === 'lawyer') {
      mockUser = {
        name: 'Barrister Rafique',
        email: 'rafique.law@legalease.com',
        role: 'lawyer',
        avatar: 'https://i.ibb.co.com/mC3p6v0/lawyer-avatar.png',
        specialization: 'Corporate & Constitutional Law',
        fee: 150
      };
    } else if (role === 'admin') {
      mockUser = {
        name: 'Admin LegalEase',
        email: 'admin@legalease.online',
        role: 'admin',
        avatar: 'https://i.ibb.co.com/gSnHqV3/admin-avatar.png'
      };
    }

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const switchRole = (role) => {
    login(role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
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

