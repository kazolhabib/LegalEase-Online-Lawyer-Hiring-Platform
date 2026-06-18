'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError('Failed to fetch analytics metrics.');
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Server network issue. Could not compile platform reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-[2rem]">
        <div className="border-b border-border/10 pb-[1rem]">
          <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Platform Analytics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-[7rem] bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-[1rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Platform Analytics</h2>
        <p className="text-[0.75rem] text-slate-500">Overview metrics, revenue sums, and platform usage.</p>
      </div>

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center max-w-[42rem]">
          {error}
        </div>
      )}

      {/* Grid Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
          
          {/* Card 1 */}
          <div className="p-[1.5rem] border border-border/80 rounded-[1rem] bg-background/25 space-y-[0.5rem]">
            <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Total Clients</p>
            <p className="text-[2.25rem] font-serif font-bold text-primary dark:text-foreground">
              {stats.totalUsers || 0}
            </p>
            <p className="text-[0.625rem] text-slate-400">Registered client accounts</p>
          </div>

          {/* Card 2 */}
          <div className="p-[1.5rem] border border-border/80 rounded-[1rem] bg-background/25 space-y-[0.5rem]">
            <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Total Attorneys</p>
            <p className="text-[2.25rem] font-serif font-bold text-primary dark:text-foreground">
              {stats.totalLawyers || 0}
            </p>
            <p className="text-[0.625rem] text-slate-400">Active listed legal specialists</p>
          </div>

          {/* Card 3 */}
          <div className="p-[1.5rem] border border-border/80 rounded-[1rem] bg-background/25 space-y-[0.5rem]">
            <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Total Bookings</p>
            <p className="text-[2.25rem] font-serif font-bold text-primary dark:text-foreground">
              {stats.totalHires || 0}
            </p>
            <p className="text-[0.625rem] text-slate-400">Consultation cases processed</p>
          </div>

          {/* Card 4 */}
          <div className="p-[1.5rem] border border-border/80 rounded-[1rem] bg-background/25 space-y-[0.5rem]">
            <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Total Revenue</p>
            <p className="text-[2.25rem] font-serif font-bold text-accent">
              ${stats.totalRevenue || 0}
            </p>
            <p className="text-[0.625rem] text-slate-400">Gross funds cleared via platform</p>
          </div>

        </div>
      )}

      {/* Visual luxury segment */}
      <div className="p-[2.5rem] border border-border/10 rounded-[1.5rem] bg-gradient-to-tr from-accent/5 via-transparent to-transparent space-y-[0.75rem] max-w-[48rem]">
        <h4 className="font-serif font-bold text-[1.25rem] text-primary dark:text-foreground italic">
           Escrow Legal Trust System Status
        </h4>
        <p className="text-[0.75rem] leading-relaxed text-slate-500 max-w-[36rem]">
          LegalEase operates on a 100% verified payment guarantee. Client hiring funds are locked in Stripe Sandbox and released directly to lawyers upon agreement, ensuring complete client-attorney protection.
        </p>
      </div>

    </div>
  );
}
