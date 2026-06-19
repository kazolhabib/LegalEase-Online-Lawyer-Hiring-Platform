'use strict';

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useTheme } from '../Providers';
import Script from 'next/script';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, user, loading } = useAuth();
  const { theme } = useTheme();
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
      theme: theme === 'dark' ? 'filled_black' : 'outline', 
      size: 'large', 
      text: 'continue_with',
      shape: 'rectangular',
      width: 320
    });
  }, [theme]);

  const initGoogleSignIn = useCallback(() => {
    if (!window.google || googleInitializedRef.current) {
      // Already initialized, just re-render button (e.g. for theme change)
      renderGoogleButton();
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '810619721461-16ub90cr5ivqb12s8o5mvjm8mss0n9kq.apps.googleusercontent.com',
      callback: handleGoogleCallback,
    });
    googleInitializedRef.current = true;
    renderGoogleButton();
  }, [handleGoogleCallback, renderGoogleButton]);

  useEffect(() => {
    if (window.google) {
      initGoogleSignIn();
    }
  }, [theme, initGoogleSignIn]);

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
    <div className="w-full min-h-[calc(100vh-16rem)] flex items-center justify-center px-[1rem] sm:px-[2rem] py-[4rem] relative">
      <div className="w-full max-w-[28rem] space-y-[2rem]">
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
          <div id="google-signin-btn"></div>
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
