'use strict';

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Providers';
import Script from 'next/script';

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin, updateRole, user, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Registration flow state: 'form' | 'role_select'
  const [stage, setStage] = useState('form');
  const [registeredUser, setRegisteredUser] = useState(null);
  
  const googleInitializedRef = useRef(false);

  // Check URL query parameters for stage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stageParam = new URLSearchParams(window.location.search).get('stage');
      if (stageParam === 'role_select') {
        setStage('role_select');
      }
    }
  }, []);

  useEffect(() => {
    // If user is already registered and role is already set, redirect
    if (!loading && user && stage === 'form') {
      router.push('/');
    }
  }, [user, loading, router, stage]);

  const handleGoogleCallback = useCallback(async (response) => {
    const idToken = response.credential;
    setSubmitting(true);
    setError('');
    try {
      const result = await googleLogin(idToken);
      if (result && result.isNewUser) {
        setRegisteredUser(result.user);
        setStage('role_select');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }, [googleLogin, router]);

  const renderGoogleButton = useCallback(() => {
    if (!window.google) return;
    const btnEl = document.getElementById("google-signup-btn");
    if (!btnEl) return;
    
    window.google.accounts.id.renderButton(btnEl, { 
      theme: 'outline', 
      size: 'large', 
      text: 'signup_with',
      shape: 'rectangular',
      width: 320
    });
  }, []);

  const initGoogleSignIn = useCallback(() => {
    if (!window.google || window.__google_initialized__) {
      renderGoogleButton();
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '810619721461-16ub90cr5ivqb12s8o5mvjm8mss0n9kq.apps.googleusercontent.com',
      callback: handleGoogleCallback,
    });
    window.__google_initialized__ = true;
    renderGoogleButton();
  }, [handleGoogleCallback, renderGoogleButton]);

  useEffect(() => {
    if (window.google) {
      initGoogleSignIn();
    }
  }, [initGoogleSignIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const u = await register(name, email, password);
      setRegisteredUser(u);
      setStage('role_select');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleSelection = async (selectedRole) => {
    setError('');
    setSubmitting(true);
    try {
      await updateRole(selectedRole);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to assign role.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-[2rem] w-[2rem] border-b-[0.125rem] border-accent" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] flex items-center justify-center px-[1rem] sm:px-[2rem] py-[4rem] relative">
      {stage === 'form' ? (
        <div className="w-full max-w-[28rem] space-y-[2rem]">
          {/* Header */}
          <div className="text-center space-y-[0.5rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Get Started</span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground italic leading-[1.1]">
              Create Account
            </h2>
            <p className="text-[0.8125rem] text-slate-500 dark:text-slate-400">
              Join LegalEase and discover premium legal verified counsel.
            </p>
          </div>

          {error && (
            <div className="p-[0.875rem] text-[0.75rem] font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[1.25rem]">
            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
              />
            </div>

            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
              />
            </div>

            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
              />
            </div>

            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-[0.75rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0.25rem_1rem_rgba(0,0,0,0.05)] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-[1.5rem]">
            <div className="absolute inset-x-0 h-[0.0625rem] bg-border/40" />
            <span className="relative px-[1rem] bg-background text-[0.6875rem] font-bold text-slate-400 uppercase tracking-widest">
              or
            </span>
          </div>

          {/* Social Authentication */}
          <div className="w-full flex justify-center py-[0.25rem]">
            <div id="google-signup-btn"></div>
          </div>

          <p className="text-center text-[0.75rem] text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      ) : (
        /* Role Selection Stage (Interactive Premium Layout) */
        <div className="w-full max-w-[32rem] space-y-[2.5rem] text-center animate-[fadeIn_300ms_ease-out]">
          <div className="space-y-[0.5rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">One Last Step</span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground italic leading-[1.1]">
              Choose Your Role
            </h2>
            <p className="text-[0.875rem] text-slate-500 dark:text-slate-400">
              Welcome, <span className="font-bold text-foreground">{registeredUser?.name || user?.name}</span>. How will you use LegalEase?
            </p>
          </div>

          {error && (
            <div className="p-[0.875rem] text-[0.75rem] font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5rem]">
            {/* User / Client Card */}
            <button
              onClick={() => handleRoleSelection('user')}
              disabled={submitting}
              className="group p-[2rem] text-left border border-border hover:border-accent hover:bg-foreground/[0.01] rounded-[1rem] transition-all duration-[300ms] cursor-pointer space-y-[1rem] focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <div className="h-[2.5rem] w-[2.5rem] rounded-[0.5rem] bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-[300ms]">
                <svg className="w-[1.25rem] h-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="space-y-[0.25rem]">
                <h4 className="font-serif font-bold text-[1.25rem] text-primary dark:text-foreground">
                  I am a Client
                </h4>
                <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                  I need to find, hire, and consult legal experts, manage bookings, and leave reviews.
                </p>
              </div>
              <div className="text-[0.75rem] font-extrabold text-accent group-hover:translate-x-[0.25rem] transition-transform duration-[200ms]">
                Select Client Profile →
              </div>
            </button>

            {/* Lawyer Card */}
            <button
              onClick={() => handleRoleSelection('lawyer')}
              disabled={submitting}
              className="group p-[2rem] text-left border border-border hover:border-accent hover:bg-foreground/[0.01] rounded-[1rem] transition-all duration-[300ms] cursor-pointer space-y-[1rem] focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <div className="h-[2.5rem] w-[2.5rem] rounded-[0.5rem] bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-[300ms]">
                <svg className="w-[1.25rem] h-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div className="space-y-[0.25rem]">
                <h4 className="font-serif font-bold text-[1.25rem] text-primary dark:text-foreground">
                  I am an Attorney
                </h4>
                <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                  I want to list my legal services, manage incoming consultation requests, and track earnings.
                </p>
              </div>
              <div className="text-[0.75rem] font-extrabold text-accent group-hover:translate-x-[0.25rem] transition-transform duration-[200ms]">
                Select Attorney Profile →
              </div>
            </button>
          </div>
        </div>
      )}

      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={initGoogleSignIn} 
        strategy="lazyOnload"
      />
    </div>
  );
}
