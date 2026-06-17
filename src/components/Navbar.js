'use strict';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme, useAuth } from '../app/Providers';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Lawyers', path: '/browse' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full sticky top-[0rem] z-[50] bg-background/80 backdrop-blur-md border-b-[0.0625rem] border-border/20 transition-all duration-[300ms]">
      <div className="editorial-container px-[1rem] sm:px-[2rem] lg:px-[3rem]">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-[0.5rem] group">
              <div className="h-[2.25rem] w-[2.25rem] rounded-[0.5rem] bg-primary dark:bg-accent flex items-center justify-center shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.1)] group-hover:rotate-[12deg] transition-transform duration-[300ms]">
                <svg className="w-[1.25rem] h-[1.25rem] text-white dark:text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="text-[1.125rem] font-extrabold tracking-tight text-primary dark:text-foreground font-sans">
                Legal<span className="text-accent">Ease</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-[0.25rem]">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-[1rem] py-[0.5rem] rounded-[0.75rem] text-[0.75rem] font-semibold tracking-wide transition-all duration-[200ms] ${
                    isActive 
                      ? 'bg-primary text-white dark:bg-accent dark:text-navy shadow-[0_0.125rem_0.375rem_rgba(0,0,0,0.05)]' 
                      : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {user && (
              <Link
                href="/dashboard"
                className={`px-[1rem] py-[0.5rem] rounded-[0.75rem] text-[0.75rem] font-semibold tracking-wide transition-all duration-[200ms] ${
                  pathname.startsWith('/dashboard') 
                    ? 'bg-primary text-white dark:bg-accent dark:text-navy shadow-[0_0.125rem_0.375rem_rgba(0,0,0,0.05)]' 
                    : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden lg:flex items-center max-w-[20rem] flex-grow mx-[1rem]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search specialization or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-[2.25rem] pr-[1rem] py-[0.375rem] text-[0.75rem] rounded-full border-[0.0625rem] border-border bg-background/55 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all duration-[200ms]"
              />
              <div className="absolute inset-y-[0rem] left-[0rem] pl-[0.75rem] flex items-center pointer-events-none text-muted">
                <svg className="h-[0.875rem] w-[0.875rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-[0.5rem]">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-[0.5rem] rounded-[0.75rem] hover:bg-foreground/5 text-foreground transition-all duration-[200ms]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-[1.125rem] h-[1.125rem] text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ) : (
                <svg className="w-[1.125rem] h-[1.125rem] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-[0.5rem]">
                <Link href="/dashboard" className="flex items-center gap-[0.5rem] group">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-[2rem] w-[2rem] rounded-[0.75rem] object-cover border-[0.0625rem] border-accent/20 group-hover:border-accent transition-all duration-[300ms]"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-[0.6875rem] font-bold text-foreground leading-tight group-hover:text-accent transition-colors">{user.name}</p>
                    <p className="text-[0.5625rem] text-muted capitalize leading-none">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="px-[0.75rem] py-[0.375rem] rounded-[0.75rem] bg-red-500/10 text-red-500 text-[0.625rem] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-[0.25rem]">
                <Link
                  href="/login"
                  className="text-[0.75rem] font-bold px-[0.75rem] py-[0.5rem] text-foreground/80 hover:text-accent transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-[0.75rem] font-bold px-[1rem] py-[0.5rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy hover:scale-[1.02] transition-all shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.05)]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-[0.5rem] md:hidden text-foreground hover:bg-foreground/5 rounded-[0.75rem] transition-all"
              aria-label="Toggle menu"
            >
              <svg className="h-[1.375rem] w-[1.375rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-[0.5rem] p-[1rem] rounded-[1rem] glass shadow-[0_0.5rem_2rem_rgba(0,0,0,0.08)] border-[0.0625rem] border-border/70 space-y-[0.75rem]">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-[0.5rem]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-[2.25rem] pr-[1rem] py-[0.5rem] text-[0.75rem] rounded-[0.75rem] border-[0.0625rem] border-border bg-background text-foreground focus:outline-none"
            />
            <div className="absolute inset-y-[0rem] left-[0rem] pl-[0.75rem] flex items-center pointer-events-none text-muted">
              <svg className="h-[0.875rem] w-[0.875rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-[0.75rem] py-[0.5rem] rounded-[0.75rem] text-[0.875rem] font-semibold ${
                pathname === link.path 
                  ? 'bg-accent/15 text-accent' 
                  : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-[0.75rem] py-[0.5rem] rounded-[0.75rem] text-[0.875rem] font-semibold ${
                pathname.startsWith('/dashboard') 
                  ? 'bg-accent/15 text-accent' 
                  : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              Dashboard
            </Link>
          )}

          {user && (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full text-left block px-[0.75rem] py-[0.5rem] rounded-[0.75rem] text-[0.875rem] font-semibold text-red-500 hover:bg-red-500/10"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
