'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Scale Icon Spinner */}
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-[3px] border-border"
          />
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent"
            style={{
              animation: 'spin 1s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-accent opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <p
          className="text-muted text-sm tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', letterSpacing: '0.2em' }}
        >
          Loading…
        </p>
      </div>

      {/* Keyframe for spinner */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
