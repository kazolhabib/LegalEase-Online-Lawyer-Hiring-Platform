'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ClientShortlistPage() {
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlist = async () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legalease_shortlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Validate each shortlisted lawyer still exists in the database
          const validatedList = [];
          for (const lawyer of parsed) {
            try {
              const res = await fetch(`${API_URL}/lawyers/${lawyer._id}`);
              if (res.ok) {
                const freshData = await res.json();
                // Update with fresh data from server
                validatedList.push(freshData);
              }
              // If not ok (404), skip this lawyer - it no longer exists
            } catch {
              // Network error - keep the cached version
              validatedList.push(lawyer);
            }
          }
          
          // Update localStorage with only valid entries
          localStorage.setItem('legalease_shortlist', JSON.stringify(validatedList));
          setShortlist(validatedList);
        } catch (err) {
          console.error('Failed to parse shortlist:', err);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = (lawyerId) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legalease_shortlist');
      if (saved) {
        try {
          const currentList = JSON.parse(saved);
          const newList = currentList.filter(l => l._id !== lawyerId);
          localStorage.setItem('legalease_shortlist', JSON.stringify(newList));
          setShortlist(newList);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem] flex items-center justify-between">
        <div>
          <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Shortlisted Lawyers</h2>
          <p className="text-[0.75rem] text-slate-500">View and manage the attorneys you bookmarked for consultations.</p>
        </div>
        <Link
          href="/browse"
          className="px-[1rem] py-[0.5rem] bg-accent/10 border border-accent/20 text-accent text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:bg-accent hover:text-navy transition-all"
        >
          Explore Catalog
        </Link>
      </div>

      {loading ? (
        <div className="animate-spin rounded-full h-[1.5rem] w-[1.5rem] border-b-[0.125rem] border-accent" />
      ) : shortlist.length === 0 ? (
        <div className="text-left py-[3rem] space-y-[1rem] max-w-[24rem]">
          <span className="text-[2rem] block">⭐</span>
          <h4 className="font-serif font-bold text-[1.125rem]">Your Shortlist is Empty</h4>
          <p className="text-[0.75rem] text-slate-500 leading-relaxed">
            You haven't bookmarked any legal counsel yet. Browse our verified advocates to build your shortlist of experts.
          </p>
          <Link
            href="/browse"
            className="inline-block px-[1.25rem] py-[0.5rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:scale-105 transition-all"
          >
            Find Lawyers Now
          </Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[2rem]"
        >
          {shortlist.map((lawyer) => (
            <motion.div
              key={lawyer._id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
              className="border border-border/80 bg-background/20 rounded-[1.25rem] overflow-hidden flex flex-col group hover:border-accent/40 hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.05)] dark:hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.4)] transition-all duration-300"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-zinc-900 overflow-hidden">
                <img
                  src={lawyer.image}
                  alt={lawyer.user?.name}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                
                {/* Status indicator */}
                <span className={`absolute bottom-[0.5rem] right-[0.5rem] h-[0.5rem] w-[0.5rem] rounded-full ${
                  lawyer.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />

                {/* Status label badge */}
                <span className="absolute bottom-[0.5rem] left-[0.5rem] px-[0.375rem] py-[0.125rem] bg-black/40 backdrop-blur-sm text-white text-[0.5rem] font-bold uppercase tracking-wider rounded-sm">
                  {lawyer.status === 'Busy' ? 'Busy' : 'Available'}
                </span>

                <button
                  onClick={() => handleRemove(lawyer._id)}
                  className="absolute top-[0.5rem] right-[0.5rem] h-[1.5rem] w-[1.5rem] rounded-full bg-black/50 text-white hover:bg-rose-600 hover:text-white flex items-center justify-center text-[0.75rem] transition-colors cursor-pointer"
                  title="Remove from shortlist"
                >
                  ✕
                </button>
              </div>

              {/* Info details */}
              <div className="p-[1.25rem] flex-1 flex flex-col justify-between space-y-[1rem]">
                <div className="space-y-[0.25rem]">
                  <h4 className="font-serif font-bold text-[1rem] tracking-tight text-primary dark:text-foreground line-clamp-1">
                    {lawyer.user?.name}
                  </h4>
                  <p className="text-[0.625rem] uppercase tracking-wider text-slate-500 font-extrabold">
                    {lawyer.specialization}
                  </p>
                  <p className="text-[0.75rem] text-accent font-bold pt-[0.25rem]">${lawyer.rate}/hr</p>
                </div>

                <div className="pt-[0.75rem] border-t border-border/10 flex gap-[0.5rem]">
                  <Link
                    href={`/lawyers/${lawyer._id}`}
                    className="flex-1 py-[0.375rem] border border-border hover:border-accent text-center text-foreground hover:text-accent text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.375rem] transition-all"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/lawyers/${lawyer._id}`}
                    className="flex-1 py-[0.375rem] bg-primary text-white dark:bg-accent dark:text-navy text-center text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.375rem] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Hire
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
