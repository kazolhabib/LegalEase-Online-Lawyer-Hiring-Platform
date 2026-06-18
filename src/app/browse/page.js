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
  
  // Pagination & Data States
  const [lawyers, setLawyers] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 8
  });
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlSpec = searchParams.get('specialization');
    if (urlSearch) setSearch(urlSearch);
    if (urlSpec) setSpecialization(urlSpec);
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
    // Re-fetch on filter/sort changes (reset to page 1)
    fetchLawyers(1);
  }, [specialization, status, sort]);

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
              className="w-full mt-[0.5rem] py-[0.375rem] rounded-[0.5rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.6875rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Apply Price Range
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
                className="mt-[1rem] px-[1.5rem] py-[0.5rem] text-[0.6875rem] font-bold bg-primary text-white dark:bg-accent dark:text-navy rounded-[0.5rem] hover:scale-105 transition-all cursor-pointer"
              >
                Clear Filters
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
                        Fully Booked
                      </span>
                    )}
                    <span className="absolute top-[0.75rem] left-[0.75rem] px-[0.375rem] py-[0.1875rem] bg-accent text-white dark:text-navy text-[0.5rem] uppercase font-bold tracking-widest">
                      {lawyer.badge || 'Verified'}
                    </span>
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
                className="px-[1rem] py-[0.5rem] border border-border text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:bg-foreground/5 disabled:opacity-30 cursor-pointer"
              >
                ← Previous
              </button>
              
              <span className="text-[0.6875rem] font-semibold text-slate-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => fetchLawyers(pagination.currentPage + 1)}
                className="px-[1rem] py-[0.5rem] border border-border text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:bg-foreground/5 disabled:opacity-30 cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
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
