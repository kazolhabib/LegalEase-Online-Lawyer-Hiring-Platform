'use client';

import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-[2px] border-border/30" />
          <div
            className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-accent"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </div>
        <p className="text-muted text-[0.6875rem] tracking-widest uppercase" style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}>
          Loading…
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
