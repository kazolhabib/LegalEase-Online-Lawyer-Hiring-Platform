'use strict';

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Providers';
import Script from 'next/script';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const googleInitializedRef = useRef(false);

  const handleGoogleCallback = useCallback(async (response) => {
    const idToken = response.credential;
    setSubmitting(true);
    setError('');
    try {
      const result = await googleLogin(idToken);
      if (result && result.isNewUser) {
        router.push('/register?stage=role_select');
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
    const btnEl = document.getElementById("google-signin-btn");
    if (!btnEl) return;
    
    window.google.accounts.id.renderButton(btnEl, { 
      theme: 'filled_black', 
      size: 'large', 
      text: 'continue_with',
      shape: 'rectangular',
      width: 320,
      locale: 'en'
    });
  }, []);

  const initGoogleSignIn = useCallback(() => {
    if (!window.google || window.__google_initialized__) {
      // Already initialized, just re-render button.
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

  useEffect(() => {
    // If already logged in, redirect to home
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
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

      <div className="w-full max-w-[32rem] space-y-[2rem] relative z-10 backdrop-blur-2xl bg-card/80 dark:bg-zinc-900/80 p-[2rem] sm:p-[3rem] rounded-[2rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.06)] dark:shadow-[0_2rem_4rem_rgba(0,0,0,0.4)] border border-border/60 dark:border-white/[0.05]">
        {/* Header */}
        <div className="text-center space-y-[0.5rem]">
          <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Welcome Back</span>
          <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground italic leading-[1.1]">
            Sign In
          </h2>
          <p className="text-[0.8125rem] text-slate-500 dark:text-slate-400">
            Access your LegalEase workspace and manage case files.
          </p>
        </div>

        {error && (
          <div className="p-[0.875rem] text-[0.75rem] font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[1.25rem]">
          <div className="space-y-[0.375rem]">
            <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="••••••••"
              required
              className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-[0.75rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0.25rem_1rem_rgba(0,0,0,0.05)] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
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
          <div className="group relative h-[2.75rem] w-full max-w-[20rem] overflow-hidden rounded-[0.5rem] transition-all duration-300 hover:-translate-y-[0.0625rem] hover:shadow-[0_0.875rem_1.75rem_rgba(0,0,0,0.18)] active:translate-y-0 active:scale-[0.99]">
            <div
              id="google-signin-btn"
              className="absolute inset-0 z-10 opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[0.75rem] rounded-[0.5rem] border border-border/70 bg-[#202124] text-white text-[0.875rem] font-semibold transition-all duration-300 group-hover:border-accent/50 group-hover:bg-[#26282d] group-hover:text-accent">
              <span className="flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full bg-transparent text-[1.125rem] font-black transition-transform duration-300 group-hover:scale-110">
                G
              </span>
              <span>Continue with Google</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[0.75rem] text-slate-500">
          New to LegalEase?{' '}
          <Link href="/register" className="font-extrabold text-accent hover:underline">
            Create an Account
          </Link>
        </p>
      </div>

      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={initGoogleSignIn} 
        strategy="lazyOnload"
      />
    </div>
  );
}
