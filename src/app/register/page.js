'use strict';

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Providers';
import Script from 'next/script';

function PasswordVisibilityButton({ isVisible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      aria-pressed={isVisible}
      className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 rounded-full p-[0.375rem] text-slate-500 hover:text-accent focus:outline-none focus:ring-[0.0625rem] focus:ring-accent transition-colors cursor-pointer"
    >
      {isVisible ? (
        <svg className="h-[1rem] w-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.8 9.8 0 0112 4.86c5.25 0 8.25 4.64 9 7.14a11.58 11.58 0 01-2.06 3.54M6.12 6.12C4.55 7.34 3.49 9.12 3 12c.75 2.5 3.75 7.14 9 7.14 1.52 0 2.85-.39 3.98-1.01" />
        </svg>
      ) : (
        <svg className="h-[1rem] w-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.14 9.75-7.14S21.75 12 21.75 12 18 19.14 12 19.14 2.25 12 2.25 12z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      )}
    </button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin, updateRole, user, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const stageTimer = setTimeout(() => {
        if (stageParam === 'role_select') {
          setStage('role_select');
        }
      }, 0);

      return () => clearTimeout(stageTimer);
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
    btnEl.innerHTML = '';
    
    window.google.accounts.id.renderButton(btnEl, { 
      theme: 'filled_black', 
      size: 'large', 
      text: 'signup_with',
      shape: 'rectangular',
      width: 320,
      locale: 'en'
    });
  }, []);

  const initGoogleSignIn = useCallback(() => {
    if (!window.google) return;
    
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '810619721461-16ub90cr5ivqb12s8o5mvjm8mss0n9kq.apps.googleusercontent.com',
      callback: handleGoogleCallback,
    });
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
      if (selectedRole === 'lawyer') {
        router.push('/dashboard/lawyer/manage-legal-profile');
      } else {
        router.push('/');
      }
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
    <div className="w-full min-h-[calc(100vh-16rem)] flex items-center justify-center px-[1rem] sm:px-[2rem] py-[4rem] relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-60 dark:opacity-40 transition-opacity duration-700">
        
        {/* Smooth CSS Animations */}
        <style>{`
          @keyframes wave-drift {
            0% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-4%) translateY(2%); }
            100% { transform: translateX(0) translateY(0); }
          }
          @keyframes orb-float-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(4%, 8%) scale(1.05); }
          }
          @keyframes orb-float-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-4%, -8%) scale(0.95); }
          }
          #google-signup-btn .nsm7Bb-HzV7m-LgbsSe-Bz112c-haAclf {
            background: transparent !important;
          }
        `}</style>

        {/* Glow Orbs */}
        <div className="absolute top-[0%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-accent/20 dark:bg-accent/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" style={{ animation: 'orb-float-1 15s ease-in-out infinite' }} />
        <div className="absolute bottom-[0%] right-[10%] w-[25rem] h-[25rem] rounded-full bg-primary/10 dark:bg-white/5 blur-[100px] mix-blend-multiply dark:mix-blend-screen" style={{ animation: 'orb-float-2 18s ease-in-out infinite' }} />
        
        {/* Abstract Topographic/Wave Vector */}
        <svg className="absolute w-[120%] h-[120%] opacity-30 dark:opacity-20" style={{ overflow: 'visible' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M-20,20 Q25,40 50,20 T120,20" fill="none" stroke="var(--accent)" strokeWidth="0.1" style={{ animation: 'wave-drift 14s ease-in-out infinite' }} />
          <path d="M-20,35 Q30,15 60,35 T120,35" fill="none" stroke="var(--accent)" strokeWidth="0.1" style={{ animation: 'wave-drift 18s ease-in-out infinite reverse' }} />
          <path d="M-20,50 Q35,70 70,50 T120,50" fill="none" stroke="var(--accent)" strokeWidth="0.1" style={{ animation: 'wave-drift 22s ease-in-out infinite' }} />
          <path d="M-20,65 Q40,45 80,65 T120,65" fill="none" stroke="var(--accent)" strokeWidth="0.1" style={{ animation: 'wave-drift 17s ease-in-out infinite reverse' }} />
          <path d="M-20,80 Q45,100 90,80 T120,80" fill="none" stroke="var(--accent)" strokeWidth="0.1" style={{ animation: 'wave-drift 25s ease-in-out infinite' }} />
        </svg>

        {/* Elegant Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(169,132,76,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(169,132,76,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      {stage === 'form' ? (
        <div className="w-full max-w-[32rem] space-y-[2rem] relative z-10 backdrop-blur-2xl bg-card/80 dark:bg-zinc-900/80 p-[2rem] sm:p-[3rem] rounded-[2rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.06)] dark:shadow-[0_2rem_4rem_rgba(0,0,0,0.4)] border border-border/60 dark:border-white/[0.05]">
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full px-[1rem] py-[0.75rem] pr-[3rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
                />
                <PasswordVisibilityButton
                  isVisible={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                />
              </div>
            </div>

            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full px-[1rem] py-[0.75rem] pr-[3rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
                />
                <PasswordVisibilityButton
                  isVisible={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                />
              </div>
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
            <div className="group relative min-h-[2.75rem] w-full max-w-[20rem] overflow-hidden rounded-[0.5rem] bg-[#202124] transition-all duration-300 hover:-translate-y-[0.0625rem] hover:shadow-[0_0.875rem_1.75rem_rgba(0,0,0,0.18)] active:translate-y-0 active:scale-[0.99]">
              <div
                id="google-signup-btn"
                className="flex justify-center"
              />
            </div>
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
        <div className="w-full max-w-[40rem] space-y-[2.5rem] text-center animate-[fadeIn_300ms_ease-out] relative z-10 backdrop-blur-2xl bg-card/80 dark:bg-zinc-900/80 p-[2rem] sm:p-[3rem] rounded-[2rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.06)] dark:shadow-[0_2rem_4rem_rgba(0,0,0,0.4)] border border-border/60 dark:border-white/[0.05]">
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
        src="https://accounts.google.com/gsi/client?hl=en" 
        onLoad={initGoogleSignIn} 
        strategy="lazyOnload"
      />
    </div>
  );
}
