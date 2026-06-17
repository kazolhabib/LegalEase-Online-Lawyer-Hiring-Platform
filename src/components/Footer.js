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

  return (
    <footer className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] mt-[4rem] border-t-[0.0625rem] border-border/20 bg-transparent relative z-[10]">
      <div className="editorial-container space-y-[3rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2rem]">
          
          {/* Logo & Intro */}
          <div className="space-y-[1rem]">
            <Link href="/" className="flex items-center gap-[0.5rem] group">
              <div className="h-[2rem] w-[2rem] rounded-[0.5rem] bg-primary dark:bg-accent flex items-center justify-center">
                <svg className="w-[1.125rem] h-[1.125rem] text-white dark:text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="text-[1rem] font-extrabold tracking-tight text-primary dark:text-foreground">
                Legal<span className="text-accent">Ease</span>
              </span>
            </Link>
            <p className="text-[0.75rem] text-muted leading-relaxed">
              LegalEase connects legal seekers and corporate businesses with highly qualified verified attorneys. Access legal representation simplified.
            </p>
            {/* Social icons */}
            <div className="flex space-x-[0.75rem] pt-[0.5rem]">
              {['Facebook', 'Twitter', 'LinkedIn'].map((platform, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-[0.5rem] rounded-[0.75rem] bg-foreground/5 hover:bg-accent hover:text-navy text-foreground/70 transition-all duration-[200ms]"
                  aria-label={platform}
                >
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider">{platform[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-[0.75rem]">
            <h4 className="text-[0.75rem] font-bold uppercase tracking-widest text-accent">Navigation</h4>
            <ul className="space-y-[0.5rem] text-[0.75rem]">
              <li>
                <Link href="/" className="text-foreground/75 hover:text-accent transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/browse" className="text-foreground/75 hover:text-accent transition-colors">Browse Lawyers</Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/75 hover:text-accent transition-colors">Specializations</Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-[0.75rem]">
            <h4 className="text-[0.75rem] font-bold uppercase tracking-widest text-accent">Resources</h4>
            <ul className="space-y-[0.5rem] text-[0.75rem]">
              <li>
                <Link href="#" className="text-foreground/75 hover:text-accent transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/75 hover:text-accent transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/75 hover:text-accent transition-colors">Attorney Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-[0.75rem]">
            <h4 className="text-[0.75rem] font-bold uppercase tracking-widest text-accent">Stay Updated</h4>
            <p className="text-[0.75rem] text-muted leading-relaxed">
              Get monthly updates on new categories and featured legal attorneys.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-[0.5rem]">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-[0.875rem] py-[0.5rem] text-[0.75rem] rounded-[0.75rem] bg-background border-[0.0625rem] border-border text-foreground focus:outline-none focus:border-accent flex-grow"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-[1rem] py-[0.5rem] rounded-[0.75rem] text-[0.75rem] font-bold bg-primary text-white dark:bg-accent dark:text-navy hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-emerald-600 disabled:text-white"
              >
                {subscribed ? 'Joined ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-[2rem] border-t-[0.0625rem] border-border/40 flex flex-col sm:flex-row justify-between items-center gap-[1rem] text-[0.625rem] text-muted uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} LegalEase Inc. All rights reserved.</p>
          <div className="flex space-x-[1rem]">
            <span className="hover:text-accent cursor-pointer">Security</span>
            <span className="hover:text-accent cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


