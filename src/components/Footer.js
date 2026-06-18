'use strict';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[6rem] md:py-[5rem] mt-[6.5rem] border-t-[0.0625rem] border-border/15 bg-slate-50/[0.04] dark:bg-zinc-950/[0.04] backdrop-blur-sm relative z-[10] overflow-hidden group/footer">
      {/* Editorial Gradient Line at the top of the footer */}
      <div className="absolute top-0 left-0 right-0 h-[0.0625rem] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Ambient Glow Effects */}
      <div className="absolute top-[-10rem] left-[10%] w-[20rem] h-[20rem] bg-accent/5 rounded-full blur-[8rem] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10rem] right-[15%] w-[25rem] h-[25rem] bg-accent/5 rounded-full blur-[10rem] pointer-events-none -z-10" />

      {/* Large Legal Scale watermark overlay */}
      <svg 
        className="absolute bottom-[-5rem] right-[-2rem] md:right-[5%] w-[22rem] h-[22rem] md:w-[32rem] md:h-[32rem] text-accent/[0.04] dark:text-accent/[0.025] pointer-events-none select-none -z-10 transition-transform duration-[1500ms] ease-out group-hover/footer:scale-105 group-hover/footer:-rotate-1" 
        fill="none" 
        viewBox="0 0 100 100" 
        stroke="currentColor" 
        strokeWidth={0.5}
      >
        {/* Center Pillar */}
        <path d="M50 85 L50 15" />
        {/* Pillar Base */}
        <path d="M35 85 L65 85" />
        <path d="M40 82 L60 82" />
        {/* Pillar Capital */}
        <path d="M45 15 L55 15" />
        <path d="M42 18 L58 18" />
        {/* Balance Beam (horizontal) */}
        <path d="M22 22 L78 22" />
        {/* Center Pivot Point */}
        <circle cx="50" cy="22" r="1.5" fill="currentColor" />
        {/* Left Scale strings & Pan */}
        <path d="M22 22 L14 45 L30 45 Z" />
        <path d="M12 45 L32 45 A 10 3 0 0 0 12 45" />
        <path d="M22 45 L22 62" />
        <path d="M17 62 L27 62" />
        {/* Right Scale strings & Pan */}
        <path d="M78 22 L70 45 L86 45 Z" />
        <path d="M68 45 L88 45 A 10 3 0 0 0 68 45" />
        <path d="M78 45 L78 62" />
        <path d="M73 62 L83 62" />
        {/* Geometry balance rings */}
        <circle cx="50" cy="50" r="32" strokeDasharray="1 5" strokeWidth={0.25} />
        <circle cx="50" cy="50" r="18" strokeDasharray="1 8" strokeWidth={0.2} />
      </svg>

      <div className="editorial-container space-y-[5rem]">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3.5rem] lg:gap-[2rem]">
          
          {/* Logo, Description & Contact info */}
          <div className="space-y-[1.5rem]">
            <Link href="/" className="flex items-center gap-[0.5rem] group w-max">
              <div className="h-[2.25rem] w-[2.25rem] rounded-[0.75rem] bg-primary dark:bg-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <svg className="w-[1.25rem] h-[1.25rem] text-white dark:text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="text-[1.125rem] font-extrabold tracking-tight text-primary dark:text-foreground">
                Legal<span className="text-accent">Ease</span>
              </span>
            </Link>
            <p className="text-[0.875rem] text-slate-500 dark:text-zinc-400 leading-relaxed font-body">
              Connecting individuals, entrepreneurs, and businesses with highly qualified verified attorneys. Access premium legal representation simplified.
            </p>
            
            {/* Social icons */}
            <div className="flex space-x-[0.5rem] pt-[0.5rem]">
              {[
                { platform: 'Facebook', icon: (
                  <svg className="w-[1.125rem] h-[1.125rem]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                )},
                { platform: 'Twitter', icon: (
                  <svg className="w-[1.125rem] h-[1.125rem]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )},
                { platform: 'LinkedIn', icon: (
                  <svg className="w-[1.125rem] h-[1.125rem]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                )},
                { platform: 'Instagram', icon: (
                  <svg className="w-[1.125rem] h-[1.125rem]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                )}
              ].map((soc, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-[2.25rem] h-[2.25rem] rounded-[0.75rem] border border-border/40 hover:border-accent bg-background/30 hover:bg-accent hover:text-navy text-foreground/70 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-105"
                  aria-label={soc.platform}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-[1.25rem] lg:pl-[3rem]">
            <h4 className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-accent">Navigation</h4>
            <ul className="space-y-[0.75rem] text-[0.875rem] font-body">
              <li>
                <Link href="/" className="group flex items-center gap-[0.375rem] text-slate-500 dark:text-zinc-400 hover:text-accent transition-colors duration-300">
                  <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="group-hover:translate-x-[0.1875rem] transition-transform duration-300">Home Page</span>
                </Link>
              </li>
              <li>
                <Link href="/browse" className="group flex items-center gap-[0.375rem] text-slate-500 dark:text-zinc-400 hover:text-accent transition-colors duration-300">
                  <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="group-hover:translate-x-[0.1875rem] transition-transform duration-300">Browse Lawyers</span>
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="group flex items-center gap-[0.375rem] text-slate-500 dark:text-zinc-400 hover:text-accent transition-colors duration-300">
                  <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="group-hover:translate-x-[0.1875rem] transition-transform duration-300">Specializations</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-[1.25rem] lg:pl-[2rem]">
            <h4 className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-accent">Resources</h4>
            <ul className="space-y-[0.75rem] text-[0.875rem] font-body">
              <li>
                <Link href="#" className="group flex items-center gap-[0.375rem] text-slate-500 dark:text-zinc-400 hover:text-accent transition-colors duration-300">
                  <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="group-hover:translate-x-[0.1875rem] transition-transform duration-300">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="group flex items-center gap-[0.375rem] text-slate-500 dark:text-zinc-400 hover:text-accent transition-colors duration-300">
                  <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="group-hover:translate-x-[0.1875rem] transition-transform duration-300">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="group flex items-center gap-[0.375rem] text-slate-500 dark:text-zinc-400 hover:text-accent transition-colors duration-300">
                  <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="group-hover:translate-x-[0.1875rem] transition-transform duration-300">Attorney Guidelines</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Luxury Newsletter Card Wrapper */}
          <div className="bg-card/40 dark:bg-zinc-900/10 border border-border/50 dark:border-border/10 p-[2rem] rounded-[2rem] space-y-[1.25rem] relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-[6rem] h-[6rem] bg-accent/5 rounded-full blur-xl -z-10" />
            <h4 className="text-[0.875rem] font-bold tracking-wider text-primary dark:text-foreground">Subscribe to Counsel</h4>
            <p className="text-[0.75rem] text-slate-500 dark:text-zinc-400 leading-relaxed font-body">
              Get selected legal briefs, practice guides, and platform updates directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-[0.625rem] w-full pt-[0.25rem]">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-[1rem] py-[0.625rem] text-[0.8125rem] rounded-[0.75rem] bg-background border border-border/60 text-foreground focus:outline-none focus:border-accent transition-colors duration-300 shadow-sm"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="w-full py-[0.625rem] rounded-[0.75rem] text-[0.8125rem] font-bold bg-primary text-white dark:bg-accent dark:text-navy hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:bg-emerald-600 disabled:text-white uppercase tracking-widest cursor-pointer shadow-sm flex items-center justify-center"
              >
                {subscribed ? 'Joined ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-[2.5rem] border-t-[0.0625rem] border-border/20 flex flex-col sm:flex-row justify-between items-center gap-[1.5rem] text-[0.75rem] text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-body">
          <p>&copy; {new Date().getFullYear()} LegalEase Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-[2rem]">
            <span className="hover:text-accent cursor-pointer transition-colors duration-300">Security</span>
            <span className="hover:text-accent cursor-pointer transition-colors duration-300">Sitemap</span>
            
            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className="h-[2.5rem] w-[2.5rem] rounded-full border border-border/40 hover:border-accent hover:bg-accent hover:text-navy text-foreground/70 transition-all duration-300 flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Back to top"
            >
              <svg className="w-[1.25rem] h-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
