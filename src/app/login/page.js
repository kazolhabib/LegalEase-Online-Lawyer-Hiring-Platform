'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Providers';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  // Google mock form states
  const [gName, setGName] = useState('Kazi Google Client');
  const [gEmail, setGEmail] = useState('kazi.google@gmail.com');
  const [gAvatar, setGAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150');

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

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!gEmail) {
      setError('Google email is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await googleLogin(gName, gEmail, gAvatar);
      setShowGoogleModal(false);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
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
        <button
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-[0.75rem] rounded-[0.75rem] border border-border bg-background/50 text-foreground text-[0.8125rem] font-bold hover:bg-foreground/5 transition-all flex items-center justify-center gap-[0.75rem] cursor-pointer"
        >
          <svg className="h-[1rem] w-[1rem]" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.48 0-6.3-2.82-6.3-6.3s2.82-6.3 6.3-6.3c1.62 0 3.09.615 4.215 1.62l3.18-3.18C19.14 2.145 15.93 1 12.24 1A10.98 10.98 0 001.25 12a10.98 10.98 0 0010.99 11c6.075 0 10.99-4.915 10.99-11 0-.74-.08-1.425-.24-2.085H12.24z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[0.75rem] text-slate-500">
          New to LegalEase?{' '}
          <Link href="/register" className="font-extrabold text-accent hover:underline">
            Create an Account
          </Link>
        </p>
      </div>

      {/* Simulated Google OAuth Portal Modal */}
      {showGoogleModal && (
        <div className="fixed inset-[0rem] z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-[1rem]">
          <div className="bg-background border border-border w-full max-w-[24rem] rounded-[1rem] shadow-[0_1rem_3rem_rgba(0,0,0,0.2)] overflow-hidden animate-[fadeIn_200ms_ease-out]">
            {/* Google Identity Bar */}
            <div className="px-[1.5rem] py-[1.25rem] border-b border-border flex items-center justify-between bg-slate-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-[0.5rem]">
                <svg className="h-[1.25rem] w-[1.25rem]" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-[0.75rem] font-bold text-foreground">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-foreground text-[0.875rem] font-bold"
              >
                ✕
              </button>
            </div>

            {/* Portal Details */}
            <form onSubmit={handleGoogleSubmit} className="p-[1.5rem] space-y-[1.25rem]">
              <p className="text-[0.75rem] text-slate-500 leading-relaxed">
                LegalEase is simulating Google OAuth. Please check or input the email you wish to sign in with:
              </p>

              <div className="space-y-[0.375rem]">
                <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-400">Display Name</label>
                <input
                  type="text"
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  required
                  className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none"
                />
              </div>

              <div className="space-y-[0.375rem]">
                <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-400">Google Email</label>
                <input
                  type="email"
                  value={gEmail}
                  onChange={(e) => setGEmail(e.target.value)}
                  required
                  className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none"
                />
              </div>

              <div className="space-y-[0.375rem]">
                <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-400">Profile Image URL</label>
                <input
                  type="text"
                  value={gAvatar}
                  onChange={(e) => setGAvatar(e.target.value)}
                  className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-[0.625rem] rounded-[0.5rem] bg-accent text-navy text-[0.75rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                Confirm Portal Authentication
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
