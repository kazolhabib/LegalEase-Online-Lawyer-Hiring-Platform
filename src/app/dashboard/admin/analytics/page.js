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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem] max-w-[48rem]">
        {/* Line Chart */}
        <div className="p-[1.5rem] border border-border/80 rounded-[1rem] bg-background/25 space-y-[1rem] text-left">
          <h3 className="text-[0.875rem] font-bold text-primary dark:text-foreground">Revenue Trend (H1 2026)</h3>
          <div className="w-full h-[200px] relative">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="currentColor" strokeDasharray="4 4" className="text-border/20 stroke-[1]" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="currentColor" strokeDasharray="4 4" className="text-border/20 stroke-[1]" />
              <line x1="40" y1="150" x2="480" y2="150" stroke="currentColor" strokeDasharray="4 4" className="text-border/20 stroke-[1]" />
              
              {/* Axis */}
              <line x1="40" y1="20" x2="40" y2="160" stroke="currentColor" className="text-border/40 stroke-[1]" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="currentColor" className="text-border/40 stroke-[1]" />

              {/* Line Path */}
              <path d="M 50 140 L 130 110 L 210 125 L 290 60 L 370 80 L 450 30" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Area path */}
              <path d="M 50 140 L 130 110 L 210 125 L 290 60 L 370 80 L 450 30 L 450 160 L 50 160 Z" fill="var(--accent)" fillOpacity="0.08" />

              {/* Data points */}
              {[
                { x: 50, y: 140, val: '$1.2K', m: 'Jan' },
                { x: 130, y: 110, val: '$2.4K', m: 'Feb' },
                { x: 210, y: 125, val: '$1.8K', m: 'Mar' },
                { x: 290, y: 60, val: '$4.5K', m: 'Apr' },
                { x: 370, y: 80, val: '$3.8K', m: 'May' },
                { x: 450, y: 30, val: '$6.2K', m: 'Jun' }
              ].map((p, i) => (
                <g key={i} className="group/dot cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="4" fill="var(--accent)" className="hover:r-[6px] transition-all" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="currentColor" className="text-[0.625rem] font-bold opacity-0 group-hover/dot:opacity-100 transition-opacity bg-background">
                    {p.val}
                  </text>
                  <text x={p.x} y="175" textAnchor="middle" fill="currentColor" className="text-[0.625rem] font-medium text-slate-400">
                    {p.m}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-[1.5rem] border border-border/80 rounded-[1rem] bg-background/25 space-y-[1.25rem] text-left">
          <h3 className="text-[0.875rem] font-bold text-primary dark:text-foreground">Bookings by Specialization</h3>
          <div className="space-y-[0.875rem]">
            {[
              { name: 'Corporate Law', count: 28, pct: '90%' },
              { name: 'Criminal Defense', count: 18, pct: '58%' },
              { name: 'Family Law', count: 22, pct: '70%' },
              { name: 'Intellectual Property', count: 12, pct: '38%' },
              { name: 'Civil Litigation', count: 15, pct: '48%' },
              { name: 'Tax Consultancy', count: 8, pct: '26%' }
            ].map((s, idx) => (
              <div key={idx} className="space-y-[0.25rem]">
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="font-semibold text-foreground">{s.name}</span>
                  <span className="font-bold text-accent">{s.count} cases</span>
                </div>
                <div className="w-full h-[0.5rem] bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-[1000ms] ease-out"
                    style={{ width: s.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
