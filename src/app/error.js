'use client';

import React from 'react';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-lg mx-auto">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2
          className="text-2xl md:text-3xl font-semibold mb-3"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
        >
          Something Went Wrong
        </h2>

        {/* Error Message */}
        <p className="text-muted text-base mb-4 leading-relaxed">
          An unexpected error occurred while loading this page. Please try again or contact support if the issue persists.
        </p>

        {/* Error Details (Dev Only) */}
        {error?.message && (
          <div className="mb-8 p-4 rounded-xl bg-card border border-border text-left">
            <p className="text-xs text-muted mb-1 font-mono uppercase tracking-wider">Error Details</p>
            <p className="text-sm text-red-400 font-mono break-all">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-medium rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg cursor-pointer"
            style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Try Again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-card transition-all duration-300"
            style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
