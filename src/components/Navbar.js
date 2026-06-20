'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme, useAuth } from '../app/Providers';

const hasCustomAvatar = (avatarUrl) => {
  return avatarUrl && avatarUrl.trim() !== '' && !avatarUrl.includes('unsplash.com/photo-1535713875002-d1d0cf377fde');
};

const DropdownItem = ({ href, icon, title, subtitle }) => (
  <Link
    href={href}
    className="group/item flex items-start gap-[0.75rem] px-[0.75rem] py-[0.625rem] rounded-[0.75rem] hover:bg-foreground/5 dark:hover:bg-white/[0.04] transition-all duration-[200ms]"
  >
    <div className="flex-shrink-0 w-[2.25rem] h-[2.25rem] rounded-[0.625rem] bg-accent/10 text-accent flex items-center justify-center group-hover/item:bg-accent group-hover/item:text-white dark:group-hover/item:text-navy transition-all duration-[300ms] shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col text-left justify-center min-h-[2.25rem]">
      <span className="text-[0.75rem] font-bold text-foreground group-hover/item:text-accent transition-colors duration-[200ms] leading-tight">{title}</span>
      {subtitle && <span className="text-[0.625rem] text-muted leading-tight mt-[0.125rem] group-hover/item:text-foreground/70 transition-colors duration-[200ms]">{subtitle}</span>}
    </div>
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`w-full sticky top-[0rem] z-[50] transition-all duration-500 ease-out px-[1rem] sm:px-[2rem] lg:px-[3rem] ${
      scrolled 
        ? 'bg-background/75 dark:bg-background/70 backdrop-blur-xl border-b-[0.0625rem] border-border/20 shadow-[0_0.25rem_2rem_rgba(0,0,0,0.04)] dark:shadow-[0_0.25rem_2rem_rgba(0,0,0,0.25)]' 
        : 'bg-transparent border-b-[0.0625rem] border-transparent'
    }`}>
      <div className="editorial-container">
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
              <div className="relative group/db">
                <button
                  className={`px-[1rem] py-[0.5rem] rounded-[0.75rem] text-[0.75rem] font-semibold tracking-wide transition-all duration-[200ms] flex items-center gap-[0.25rem] cursor-pointer ${
                    pathname.startsWith('/dashboard') 
                      ? 'bg-primary text-white dark:bg-accent dark:text-navy shadow-[0_0.125rem_0.375rem_rgba(0,0,0,0.05)]' 
                      : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  <span>Dashboard</span>
                  <svg className="w-[0.625rem] h-[0.625rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute left-[50%] -translate-x-1/2 top-[100%] pt-[0.5rem] w-[18rem] opacity-0 pointer-events-none group-hover/db:opacity-100 group-hover/db:pointer-events-auto transition-all duration-300 scale-95 origin-top group-hover/db:scale-100 z-[60]">
                  <div className="backdrop-blur-2xl bg-card/95 dark:bg-[#121215]/95 border border-border/60 dark:border-white/[0.06] p-[0.625rem] rounded-[1.25rem] shadow-[0_1.5rem_3rem_rgba(0,0,0,0.12)] dark:shadow-[0_1.5rem_3rem_rgba(0,0,0,0.5)] flex flex-col gap-[0.125rem]">
                    
                    {/* Dropdown Header */}
                    <div className="px-[0.75rem] py-[0.5rem] mb-[0.25rem] border-b border-border/40 dark:border-white/[0.04] flex flex-col gap-[0.125rem]">
                      <p className="text-[0.625rem] font-extrabold text-accent uppercase tracking-widest">
                        {user.role === 'admin' ? 'Admin Portal' : user.role === 'lawyer' ? 'Lawyer Console' : 'Client Dashboard'}
                      </p>
                      <p className="text-[0.6875rem] font-medium text-muted truncate">{user.email || user.name}</p>
                    </div>

                    <DropdownItem 
                      href="/dashboard"
                      icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>}
                      title="Profile Overview"
                      subtitle="Overview of your account & status"
                    />
                    
                    {user.role === 'admin' && (
                      <>
                        <DropdownItem 
                          href="/dashboard/admin/manage-users"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                          title="Manage Users"
                          subtitle="Control portal users & permissions"
                        />
                        <DropdownItem 
                          href="/dashboard/admin/manage-listings"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                          title="Manage Listings"
                          subtitle="Verify & edit lawyer details"
                        />
                        <DropdownItem 
                          href="/dashboard/admin/all-transactions"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                          title="All Transactions"
                          subtitle="View platform payment history"
                        />
                        <DropdownItem 
                          href="/dashboard/admin/analytics"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                          title="Platform Analytics"
                          subtitle="Analyze system growth metrics"
                        />
                      </>
                    )}

                    {user.role === 'lawyer' && (
                      <>
                        <DropdownItem 
                          href="/dashboard/lawyer/hiring-history"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                          title="Hiring Requests"
                          subtitle="View & respond to client offers"
                        />
                        <DropdownItem 
                          href="/dashboard/lawyer/manage-legal-profile"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
                          title="Manage Service Profile"
                          subtitle="Configure your legal parameters"
                        />
                        <DropdownItem 
                          href="/dashboard/user/update-profile"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                          title="Update Profile"
                          subtitle="Modify personal account details"
                        />
                      </>
                    )}

                    {user.role !== 'admin' && user.role !== 'lawyer' && (
                      <>
                        <DropdownItem 
                          href="/dashboard/user/hiring-history"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          title="Hiring History"
                          subtitle="Track your cases & lawyer hirings"
                        />
                        <DropdownItem 
                          href="/dashboard/user/shortlist"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                          title="Shortlisted Lawyers"
                          subtitle="View saved lawyers for fast hiring"
                        />
                        <DropdownItem 
                          href="/dashboard/user/update-profile"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                          title="Update Profile"
                          subtitle="Modify personal account details"
                        />
                        <DropdownItem 
                          href="/dashboard/user/comments"
                          icon={<svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.364 1.25.586 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.178 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 9.92c-.778-.56-.375-1.81.586-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" /></svg>}
                          title="My Reviews"
                          subtitle="Manage lawyer feedback & ratings"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                  {hasCustomAvatar(user.avatar) ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-[2rem] w-[2rem] rounded-[0.75rem] object-cover border-[0.0625rem] border-accent/20 group-hover:border-accent transition-all duration-[300ms]"
                    />
                  ) : (
                    <div className="h-[2rem] w-[2rem] rounded-[0.75rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:border-accent transition-all duration-[300ms]">
                      <svg className="w-[1rem] h-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
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
                  className="relative text-[0.75rem] font-bold px-[0.75rem] py-[0.5rem] text-foreground/80 hover:text-accent transition-all group/signin pb-[2px] inline-flex items-center"
                >
                  <span>Sign In</span>
                  <span className="absolute bottom-0 left-[0.75rem] right-[0.75rem] h-[0.0625rem] bg-accent origin-left scale-x-0 group-hover/signin:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
                <Link
                  href="/register"
                  className="relative text-[0.75rem] font-bold px-[1rem] py-[0.5rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy hover:scale-[1.02] transition-all shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.05)] group overflow-hidden inline-flex items-center justify-center"
                >
                  {/* Sliding Accent Background */}
                  <span className="absolute inset-0 bg-accent dark:bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-navy">
                    Get Started
                  </span>
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
