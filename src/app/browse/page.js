'use strict';

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

function BrowseLawyersContent() {
  const searchParams = useSearchParams();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [status, setStatus] = useState('');
  const [rateMin, setRateMin] = useState('');
  const [rateMax, setRateMax] = useState('');
  const [sort, setSort] = useState('dateJoined');
  const [filtersReady, setFiltersReady] = useState(false);
  
  // Pagination & Data States
  const [lawyers, setLawyers] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 8
  });
  const [loading, setLoading] = useState(true);

  // Shortlist States
  const [shortlistedIds, setShortlistedIds] = useState([]);

  useEffect(() => {
    const shortlistTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('legalease_shortlist');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setShortlistedIds(parsed.map(l => l._id));
          } catch (err) {
            console.error(err);
          }
        }
      }
    }, 0);

    return () => clearTimeout(shortlistTimer);
  }, []);

  const toggleShortlist = (lawyer, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legalease_shortlist');
      let currentList = [];
      if (saved) {
        try {
          currentList = JSON.parse(saved);
        } catch (err) {
          console.error(err);
        }
      }
      
      const exists = currentList.find(l => l._id === lawyer._id);
      let newList;
      if (exists) {
        newList = currentList.filter(l => l._id !== lawyer._id);
      } else {
        newList = [...currentList, lawyer];
      }
      localStorage.setItem('legalease_shortlist', JSON.stringify(newList));
      setShortlistedIds(newList.map(l => l._id));
    }
  };

  // Initialize filters from URL parameters FIRST, then mark ready
  useEffect(() => {
    const filtersTimer = setTimeout(() => {
      const urlSearch = searchParams.get('search');
      const urlSpec = searchParams.get('specialization');
      if (urlSearch) setSearch(urlSearch);
      if (urlSpec) setSpecialization(urlSpec);
      // Mark filters as ready so fetch can proceed
      setFiltersReady(true);
    }, 0);

    return () => clearTimeout(filtersTimer);
  }, [searchParams]);

  // Fetch lawyers when filters or page change
  const fetchLawyers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNumber,
        limit: 8,
        sort
      });

      if (search) queryParams.append('search', search);
      if (specialization) queryParams.append('specialization', specialization);
      if (status) queryParams.append('status', status);
      if (rateMin) queryParams.append('rateMin', rateMin);
      if (rateMax) queryParams.append('rateMax', rateMax);

      const res = await fetch(`${API_URL}/lawyers?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLawyers(data.lawyers || []);
        setPagination(data.pagination || {
          totalCount: 0,
          totalPages: 1,
          currentPage: pageNumber,
          limit: 8
        });
      }
    } catch (err) {
      console.error('Failed to fetch lawyers list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch after URL params have been applied
    if (!filtersReady) return;
    const fetchTimer = setTimeout(() => {
      fetchLawyers(1);
    }, 0);

    return () => clearTimeout(fetchTimer);
  }, [filtersReady, specialization, status, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLawyers(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('');
    setStatus('');
    setRateMin('');
    setRateMax('');
    setSort('dateJoined');
    // Fetch directly to reset UI
    setTimeout(() => fetchLawyers(1), 50);
  };

  return (
    <div className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[3rem] editorial-container">
      {/* Title Header */}
      <div className="space-y-[0.5rem] mb-[3rem] text-left">
        <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Bar Register</span>
        <h2 className="font-serif text-[2.5rem] sm:text-[3.5rem] font-normal tracking-tight text-primary dark:text-foreground">
          Browse Legal Advocates
        </h2>
        <p className="text-[0.8125rem] text-slate-500 max-w-[28rem]">
          Search our catalog of verified attorneys by specialization, hourly consulting rates, and schedule availability.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[3rem] items-start">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-[18rem] space-y-[2rem] p-[1.5rem] border border-border/80 bg-background/30 rounded-[1rem] flex-shrink-0">
          <div className="flex items-center justify-between pb-[1rem] border-b border-border/10">
            <h4 className="text-[0.75rem] uppercase tracking-wider font-extrabold text-primary dark:text-foreground">Filters</h4>
            <button
              onClick={handleResetFilters}
              className="text-[0.6875rem] font-semibold text-accent hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-[0.375rem]">
            <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Name Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search advocate..."
                className="w-full pl-[1rem] pr-[2.25rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent"
              />
              <button 
                type="submit"
                className="absolute inset-y-0 right-0 pr-[0.75rem] flex items-center text-slate-400 hover:text-accent cursor-pointer"
              >
                →
              </button>
            </div>
          </form>

          {/* Specialization Filter */}
          <div className="space-y-[0.375rem]">
            <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Practice Area</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none text-foreground"
            >
              <option value="">All Specializations</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Criminal Defense">Criminal Defense</option>
              <option value="Family Law">Family Law</option>
              <option value="Intellectual Property">Intellectual Property</option>
              <option value="Civil Litigation">Civil Litigation</option>
              <option value="Tax Consultancy">Tax Consultancy</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="space-y-[0.375rem]">
            <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none text-foreground"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
          </div>

          {/* Rate Range filter */}
          <div className="space-y-[0.5rem]">
            <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Hourly Fee Range ($)</label>
            <div className="flex gap-[0.5rem] items-center">
              <input
                type="number"
                value={rateMin}
                onChange={(e) => setRateMin(e.target.value)}
                placeholder="Min"
                className="w-full px-[0.5rem] py-[0.375rem] text-[0.75rem] rounded-[0.375rem] border border-border bg-background text-center focus:outline-none"
              />
              <span className="text-slate-400 text-[0.75rem]">-</span>
              <input
                type="number"
                value={rateMax}
                onChange={(e) => setRateMax(e.target.value)}
                placeholder="Max"
                className="w-full px-[0.5rem] py-[0.375rem] text-[0.75rem] rounded-[0.375rem] border border-border bg-background text-center focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchLawyers(1)}
              className="relative w-full mt-[0.5rem] py-[0.375rem] rounded-[0.5rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.6875rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group overflow-hidden"
            >
              {/* Sliding Accent Background */}
              <span className="absolute inset-0 bg-accent dark:bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              
              <span className="relative z-10 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-navy">
                Apply Price Range
              </span>
            </button>
          </div>

          {/* Sorting */}
          <div className="space-y-[0.375rem]">
            <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none text-foreground"
            >
              <option value="dateJoined">Recently Joined</option>
              <option value="rate_asc">Fee: Low to High</option>
              <option value="rate_desc">Fee: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Lawyers Feed Results */}
        <div className="flex-grow w-full space-y-[4rem]">
          {loading ? (
            /* Skeleton Cards */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[2.5rem] gap-y-[3.5rem]">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="flex flex-col space-y-[1rem] animate-pulse">
                  <div className="aspect-[3/4] bg-slate-200 dark:bg-zinc-800" />
                  <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-3/4" />
                  <div className="h-[0.75rem] bg-slate-200 dark:bg-zinc-800 w-1/2" />
                  <div className="h-[1.25rem] bg-slate-200 dark:bg-zinc-800 w-full" />
                </div>
              ))}
            </div>
          ) : lawyers.length === 0 ? (
            /* Empty State */
            <div className="text-center py-[6rem] space-y-[1rem]">
              <span className="text-[2rem] block">🔍</span>
              <h4 className="font-serif font-bold text-[1.25rem]">No Lawyers Match Your Filters</h4>
              <p className="text-[0.75rem] text-slate-500 max-w-[20rem] mx-auto leading-relaxed">
                Try resetting or widening your search query, specialization selects, and price parameters.
              </p>
              <button
                onClick={handleResetFilters}
                className="relative mt-[1rem] px-[1.5rem] py-[0.5rem] text-[0.6875rem] font-bold bg-primary text-white dark:bg-accent dark:text-navy rounded-[0.5rem] hover:scale-105 transition-all cursor-pointer group overflow-hidden"
              >
                {/* Sliding Accent Background */}
                <span className="absolute inset-0 bg-accent dark:bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                
                <span className="relative z-10 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-navy">
                  Clear Filters
                </span>
              </button>
            </div>
          ) : (
            /* Lawyers Grid */
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[2.5rem] gap-y-[3.5rem]"
            >
              {lawyers.map((lawyer) => (
                <motion.div
                  key={lawyer._id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                  }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-zinc-900 mb-[1rem]">
                    <img
                      src={lawyer.image}
                      alt={lawyer.user?.name}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[600ms] ease-out"
                    />
                    <span className={`absolute bottom-[0.75rem] right-[0.75rem] h-[0.5rem] w-[0.5rem] rounded-full ${
                      lawyer.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />
                    {lawyer.status === 'Busy' && (
                      <span className="absolute bottom-[0.5rem] left-[0.5rem] px-[0.375rem] py-[0.125rem] bg-rose-500 text-white text-[0.5rem] font-bold uppercase tracking-wider rounded-sm">
                        Busy
                      </span>
                    )}
                    <span className="absolute top-[0.75rem] left-[0.75rem] px-[0.375rem] py-[0.1875rem] bg-accent text-white dark:text-navy text-[0.5rem] uppercase font-bold tracking-widest">
                      {lawyer.badge || 'Verified'}
                    </span>

                    {/* Star / Shortlist Button */}
                    <button
                      onClick={(e) => toggleShortlist(lawyer, e)}
                      className="absolute top-[0.75rem] right-[0.75rem] h-[1.75rem] w-[1.75rem] rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 flex items-center justify-center text-[1rem] transition-all duration-200 shadow-sm cursor-pointer z-10"
                      title={shortlistedIds.includes(lawyer._id) ? "Remove from Shortlist" : "Add to Shortlist"}
                    >
                      <span className={shortlistedIds.includes(lawyer._id) ? "text-amber-400 font-bold" : "text-white"}>
                        {shortlistedIds.includes(lawyer._id) ? "★" : "☆"}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-[0.375rem]">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-serif font-bold text-[1.125rem] tracking-tight text-primary dark:text-foreground group-hover:text-accent transition-colors duration-[200ms] line-clamp-1">
                        {lawyer.user?.name}
                      </h4>
                      <span className="text-[0.75rem] font-bold text-accent">${lawyer.rate}/hr</span>
                    </div>
                    <p className="text-[0.6875rem] uppercase tracking-wider text-slate-500 font-medium">
                      {lawyer.specialization}
                    </p>
                    
                    {/* Rating footer */}
                    <div className="flex items-center justify-between pt-[0.375rem] border-t border-border/10 text-[0.6875rem]">
                      <div className="flex items-center gap-[0.125rem]">
                        <span className="text-amber-500">★</span>
                        <span className="font-bold text-foreground">{lawyer.ratingAverage?.toFixed(1) || '5.0'}</span>
                        <span className="text-slate-500">({lawyer.reviewsCount || 0})</span>
                      </div>
                      <Link
                        href={`/lawyers/${lawyer._id}`}
                        className="relative font-bold text-accent uppercase tracking-wider text-[0.625rem] group/btn inline-flex items-center pb-[2px]"
                      >
                        <span>View Profile →</span>
                        <span className="absolute bottom-0 left-0 w-full h-[0.0625rem] bg-accent origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 ease-out" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-[2rem] border-t border-border/10">
              <button
                disabled={pagination.currentPage === 1 || loading}
                onClick={() => fetchLawyers(pagination.currentPage - 1)}
                className="relative px-[1rem] py-[0.5rem] border border-border text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:bg-foreground/5 disabled:opacity-30 cursor-pointer group overflow-hidden disabled:pointer-events-none"
              >
                {/* Sliding Accent Background */}
                <span className="absolute inset-0 bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white dark:group-hover:text-navy">
                  ← Previous
                </span>
              </button>
              
              <span className="text-[0.6875rem] font-semibold text-slate-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => fetchLawyers(pagination.currentPage + 1)}
                className="relative px-[1rem] py-[0.5rem] border border-border text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:bg-foreground/5 disabled:opacity-30 cursor-pointer group overflow-hidden disabled:pointer-events-none"
              >
                {/* Sliding Accent Background */}
                <span className="absolute inset-0 bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white dark:group-hover:text-navy">
                  Next →
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="relative left-1/2 mt-[5rem] md:mt-[6.5rem] w-screen -translate-x-1/2 px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[5rem] md:py-[6rem] border-t border-border/10 bg-slate-50/30 dark:bg-zinc-950/20 overflow-hidden">
        <div className="hidden sm:block absolute top-[4rem] left-[-8rem] h-[20rem] w-[20rem] rounded-full bg-accent/[0.04] blur-[7rem] pointer-events-none" />
        <div className="hidden sm:block absolute bottom-[-8rem] right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-primary/[0.03] dark:bg-accent/[0.025] blur-[8rem] pointer-events-none" />

        <div className="editorial-container relative">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center space-y-[0.75rem] mb-[3.5rem]"
          >
            <span className="text-[0.625rem] uppercase tracking-[0.25em] text-accent font-extrabold block">Secure Marketplace</span>
            <h2 className="font-serif text-[2.25rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground">
              Built on Trust & Security
            </h2>
            <p className="mx-auto max-w-[34rem] text-[0.875rem] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Browse with confidence knowing every consultation begins with verified profiles, transparent fees, and protected client records.
            </p>
            <div className="h-[0.0625rem] w-[3.5rem] bg-accent/30 mx-auto mt-[1.5rem]" />
          </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.12
              }
            }
          }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-[1rem] lg:gap-[1.25rem]"
        >
          {[
            {
              title: 'Verified Legal Profiles',
              desc: 'Every listed advocate is connected to a profile review, practice category, rate, availability, and client feedback trail.',
              stat: 'Profile checked',
              icon: (
                <svg className="w-[2rem] h-[2rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              )
            },
            {
              title: 'Transparent Hiring Flow',
              desc: 'Clients can shortlist, inspect ratings, compare hourly fees, and move into a clear hiring request without guesswork.',
              stat: 'No hidden steps',
              icon: (
                <svg className="w-[2rem] h-[2rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h10.5m-10.5 4.5h7.5" />
                </svg>
              )
            },
            {
              title: 'Escrow-Ready Counsel',
              desc: 'Accepted consultations move into protected payment handling, keeping both client and attorney aligned before work begins.',
              stat: 'Payment protected',
              icon: (
                <svg className="w-[2rem] h-[2rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5A2.25 2.25 0 0 0 19.5 19.5v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75A2.25 2.25 0 0 0 6.75 21.75Z" />
                </svg>
              )
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="group rounded-[1.25rem] border border-border/50 bg-background/35 dark:bg-zinc-950/20 p-[1.5rem] sm:p-[1.75rem] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_1.25rem_3rem_rgba(169,132,76,0.06)]"
            >
              <div className="flex items-start justify-between gap-[1rem] mb-[1.75rem]">
                <div className="text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                  {item.icon}
                </div>
                <span className="font-serif italic text-[0.875rem] text-accent/60">0{index + 1}.</span>
              </div>

              <span className="inline-flex rounded-full border border-accent/15 bg-accent/10 px-[0.625rem] py-[0.25rem] text-[0.5625rem] font-black uppercase tracking-wider text-accent mb-[1rem]">
                {item.stat}
              </span>

              <h3 className="font-serif text-[1.35rem] font-bold tracking-tight text-primary dark:text-foreground group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <div className="my-[1rem] h-[0.0625rem] w-[2rem] bg-accent/30 group-hover:w-[3.5rem] group-hover:bg-accent/70 transition-all duration-500" />
              <p className="text-[0.8125rem] text-slate-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-[1rem] sm:mt-[1.25rem] rounded-[1.25rem] border border-accent/15 bg-accent/[0.06] px-[1rem] sm:px-[1.5rem] py-[1rem] flex flex-col md:flex-row md:items-center justify-between gap-[1rem]"
        >
          <div>
            <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-accent">Need a confident first step?</p>
            <p className="text-[0.8125rem] text-slate-500 dark:text-zinc-400 mt-[0.125rem]">
              Start by comparing practice areas, ratings, availability, and rates before opening a case.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center justify-center rounded-[0.75rem] border border-accent/25 px-[1rem] py-[0.625rem] text-[0.6875rem] font-black uppercase tracking-wider text-accent hover:bg-accent hover:text-navy transition-all cursor-pointer"
          >
            Refine Search
          </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function BrowseLawyersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-[2rem] w-[2rem] border-b-[0.125rem] border-accent" />
      </div>
    }>
      <BrowseLawyersContent />
    </Suspense>
  );
}
