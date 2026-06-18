'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const initialCategories = [
  { name: 'Corporate Law', count: '... Lawyers', desc: 'Business formation, mergers, contracts, and IP protection.', icon: '⚖️', num: '01' },
  { name: 'Criminal Defense', count: '... Lawyers', desc: 'DUI, felonies, federal offenses, and litigation.', icon: '🛡️', num: '02' },
  { name: 'Family Law', count: '... Lawyers', desc: 'Divorce, child custody, adoption, and prenups.', icon: '🏠', num: '03' },
  { name: 'Intellectual Property', count: '... Lawyers', desc: 'Patents, trademarks, copyrights, and licensing.', icon: '💡', num: '04' },
  { name: 'Civil Litigation', count: '... Lawyers', desc: 'Property disputes, breaches of contract, and injury claims.', icon: '📜', num: '05' },
  { name: 'Tax Consultancy', count: '... Lawyers', desc: 'Corporate tax, audits, wealth planning, and IRS disputes.', icon: '💵', num: '06' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [topExperts, setTopExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(initialCategories);

  const slides = [
    {
      title: "Find & Hire Expert Legal Counsel",
      subtitle: "The Premier Legal Marketplace",
      description: "Get matched with top-tier verified lawyers in corporate, criminal, and family law. Safe, secure, and professional.",
      ctaText: "Browse Lawyers",
      ctaLink: "/browse",
      icon: (
        <svg className="w-[8rem] h-[8rem] text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      title: "Confidential Online Consultations",
      subtitle: "Secure & Professional",
      description: "Schedule consultations and talk to elite legal attorneys securely from your home. Client-attorney privilege guaranteed.",
      ctaText: "Explore Specializations",
      ctaLink: "#categories",
      icon: (
        <svg className="w-[8rem] h-[8rem] text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6c0 3.517 1.009 6.799 2.753 9.571m3.44-2.04A13.93 13.93 0 0112 16.5c.348 0 .692.012 1.033.037m3.44-2.04A13.921 13.921 0 0015 11V5a2 2 0 00-2-2h-2m2 0h2a2 2 0 012 2v6c0 3.517-1.009 6.799-2.753 9.57m-3.44-2.04A13.916 13.916 0 0015 11" />
        </svg>
      )
    },
    {
      title: "Secure Payments & Verified Work",
      subtitle: "Escrow Protection System",
      description: "Your hiring fees are safely held in escrow using Stripe and released only when your work is completed and accepted.",
      ctaText: "Why Choose Us",
      ctaLink: "#trust",
      icon: (
        <svg className="w-[8rem] h-[8rem] text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const fallbackLawyers = [
    {
      _id: '1',
      user: { name: 'Barrister Rafique-ul Huq', avatar: '' },
      specialization: 'Corporate & Constitutional Law',
      rate: 150,
      ratingAverage: 4.9,
      reviewsCount: 124,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Gold Partner'
    },
    {
      _id: '2',
      user: { name: 'Advocate Rokeya Rahman', avatar: '' },
      specialization: 'Family & Civil Law',
      rate: 120,
      ratingAverage: 4.8,
      reviewsCount: 98,
      status: 'Busy',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Highly Rated'
    },
    {
      _id: '3',
      user: { name: 'Dr. Kamal Hossain', avatar: '' },
      specialization: 'International Arbitration',
      rate: 250,
      ratingAverage: 5.0,
      reviewsCount: 215,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Senior Council'
    },
    {
      _id: '4',
      user: { name: 'Advocate Tanjib-ul Alam', avatar: '' },
      specialization: 'Telecom & Corporate Law',
      rate: 180,
      ratingAverage: 4.7,
      reviewsCount: 82,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Rising Star'
    },
    {
      _id: '5',
      user: { name: 'Zakir A. Khan, LL.M.', avatar: '' },
      specialization: 'Criminal Litigation',
      rate: 130,
      ratingAverage: 4.9,
      reviewsCount: 104,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Trial Expert'
    },
    {
      _id: '6',
      user: { name: 'Sara Hossain', avatar: '' },
      specialization: 'Human Rights & Labor Law',
      rate: 110,
      ratingAverage: 4.9,
      reviewsCount: 147,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Pro Bono Award'
    },
    {
      _id: '7',
      user: { name: 'Barrister Nihad Kabir', avatar: '' },
      specialization: 'Corporate & Labor Law',
      rate: 200,
      ratingAverage: 4.8,
      reviewsCount: 115,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Senior Counsel'
    },
    {
      _id: '8',
      user: { name: 'Advocate Syeda Rizwana Hasan', avatar: '' },
      specialization: 'Environmental & Family Law',
      rate: 140,
      ratingAverage: 4.9,
      reviewsCount: 92,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Mediation Expert'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const updatedCategories = await Promise.all(
          initialCategories.map(async (cat) => {
            const res = await fetch(`${API_URL}/lawyers?specialization=${encodeURIComponent(cat.name)}&limit=1`);
            if (res.ok) {
              const data = await res.json();
              const count = data.pagination?.totalCount ?? 0;
              return {
                ...cat,
                count: `${count} ${count === 1 ? 'Lawyer' : 'Lawyers'}`
              };
            }
            return cat;
          })
        );
        setCategories(updatedCategories);
      } catch (err) {
        console.error('Failed to fetch category counts:', err);
      }
    };

    fetchCategoryCounts();
  }, []);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`${API_URL}/lawyers?limit=8`);
        if (res.ok) {
          const data = await res.json();
          if (data.lawyers && data.lawyers.length > 0) {
            setFeaturedLawyers(data.lawyers);
            // Sort by reviews count and average rating to identify top experts
            const sorted = [...data.lawyers]
              .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0) || (b.ratingAverage || 0) - (a.ratingAverage || 0))
              .slice(0, 3);
            setTopExperts(sorted);
          } else {
            setFeaturedLawyers(fallbackLawyers);
            setTopExperts(fallbackLawyers.slice(0, 3));
          }
        } else {
          setFeaturedLawyers(fallbackLawyers);
          setTopExperts(fallbackLawyers.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load lawyers from API, using fallback:', err);
        setFeaturedLawyers(fallbackLawyers);
        setTopExperts(fallbackLawyers.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  return (
    <div className="relative min-h-screen">
      
      {/* Hero Banner Section with Framer Motion Fade-in */}
      <section className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] pt-[3rem] pb-[4rem] relative z-[10]">
        <div className="editorial-container flex flex-col md:flex-row items-center justify-between gap-[3rem]">
          {/* Content */}
          <motion.div 
            key={activeSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[42rem] space-y-[1.5rem] text-left"
          >
            <span className="text-[0.75rem] font-bold uppercase tracking-widest text-accent">
              {slides[activeSlide].subtitle}
            </span>
            <h1 className="font-serif text-[2.75rem] sm:text-[4.75rem] font-medium tracking-tight leading-[1.05] text-primary dark:text-foreground italic">
              {slides[activeSlide].title}
            </h1>
            <p className="text-[0.9375rem] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[32rem]">
              {slides[activeSlide].description}
            </p>
            <div className="pt-[1rem]">
              <Link
                href={slides[activeSlide].ctaLink}
                className="inline-block pb-[0.25rem] border-b-[0.125rem] border-accent text-[0.8125rem] font-extrabold text-primary dark:text-foreground tracking-wider uppercase hover:text-accent transition-colors"
              >
                {slides[activeSlide].ctaText} →
              </Link>
            </div>
          </motion.div>

          {/* Large Abstract Icon */}
          <motion.div 
            key={`icon-${activeSlide}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex flex-shrink-0 justify-center items-center h-[14rem] w-[14rem]"
          >
            {slides[activeSlide].icon}
          </motion.div>
        </div>

        {/* Minimal Control panel */}
        <div className="editorial-container flex items-center justify-between pt-[2rem] border-t-[0.0625rem] border-border/10 mt-[3rem]">
          <div className="flex items-center gap-[0.5rem]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-[0.125rem] rounded-full transition-all duration-[300ms] ${
                  activeSlide === i ? 'w-[2.5rem] bg-accent' : 'w-[1.25rem] bg-slate-300 dark:bg-zinc-800'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <span className="text-[0.6875rem] font-mono uppercase tracking-wider text-slate-400">
            Slide 0{activeSlide + 1} / 0{slides.length}
          </span>
        </div>
      </section>

      {/* Featured Categories (Borderless Grid) */}
      <section id="categories" className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-[1.5rem] mb-[4rem]">
            <div className="space-y-[0.5rem]">
              <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Practice Areas</span>
              <h2 className="font-serif text-[2.25rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground">Explore Legal Specialties</h2>
            </div>
            <p className="text-[0.8125rem] text-slate-500 dark:text-slate-400 max-w-[22rem]">
              Select a specialized legal area to find dedicated lawyers verified for quick escrow consultancy hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2rem] w-full">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={`/browse?specialization=${encodeURIComponent(cat.name)}`}
                className="relative flex flex-col justify-between p-[1.75rem] bg-card/60 dark:bg-zinc-900/30 backdrop-blur-md border border-border/50 rounded-[1.5rem] hover:-translate-y-1.5 hover:border-accent/40 hover:bg-card hover:shadow-[0_1.25rem_2.5rem_rgba(169,132,76,0.06)] dark:hover:shadow-[0_1.25rem_2.5rem_rgba(0,0,0,0.4)] transition-all duration-[400ms] group overflow-hidden"
              >
                {/* Hover glow highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-[1.25rem]">
                  {/* Header row: Icon & Number */}
                  <div className="flex items-center justify-between">
                    <div className="h-[2.75rem] w-[2.75rem] rounded-[1rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-[1.25rem] shadow-sm group-hover:scale-105 transition-transform">
                      {cat.icon}
                    </div>
                    <span className="text-[0.8125rem] font-mono text-accent/50 font-bold group-hover:text-accent transition-colors duration-300">
                      {cat.num}
                    </span>
                  </div>

                  {/* Content: Title & Description */}
                  <div className="space-y-[0.5rem]">
                    <h4 className="font-serif font-bold text-[1.25rem] text-primary dark:text-foreground group-hover:text-accent transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed min-h-[3.25rem]">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {/* Footer: Count & Explore */}
                <div className="flex items-center justify-between pt-[1.25rem] mt-[1.25rem] border-t border-border/10">
                  <span className="inline-block bg-accent/10 dark:bg-accent/5 border border-accent/20 dark:border-accent/10 text-accent text-[0.625rem] uppercase font-black tracking-widest px-[0.625rem] py-[0.25rem] rounded-md shadow-sm">
                    {cat.count}
                  </span>
                  <span className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest flex items-center gap-[0.25rem]">
                    <span>Explore</span>
                    <span className="transform group-hover:translate-x-[0.25rem] transition-transform duration-[200ms]">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lawyers Section (Dynamic, Premium Full-Image Grid) */}
      <section className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="text-center space-y-[0.5rem] mb-[4rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Elite Advocates</span>
            <h2 className="font-serif text-[2.25rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground">Featured Legal Advocates</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2rem] w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-slate-200 dark:bg-zinc-800 rounded-[2rem] border border-border/30 p-[1rem] animate-pulse max-w-[24rem] sm:max-w-none w-full mx-auto">
                  <div className="absolute bottom-[1rem] left-[1rem] right-[1rem] bg-slate-300/60 dark:bg-zinc-900/60 border border-border/10 p-[1.125rem] rounded-[1.5rem] space-y-[0.5rem]">
                    <div className="h-[0.5625rem] bg-slate-400 dark:bg-zinc-700 rounded w-1/4" />
                    <div className="h-[1.25rem] bg-slate-400 dark:bg-zinc-700 rounded w-3/4" />
                    <div className="h-[0.75rem] bg-slate-400 dark:bg-zinc-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2rem] w-full"
            >
              {featuredLawyers.map((lawyer) => (
                <motion.div 
                  key={lawyer._id} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-border/30 hover:border-accent/40 shadow-sm hover:shadow-[0_1.5rem_3.5rem_rgba(169,132,76,0.15)] dark:hover:shadow-[0_1.5rem_3.5rem_rgba(0,0,0,0.6)] hover:-translate-y-1.5 transition-all duration-500 group cursor-pointer max-w-[24rem] sm:max-w-none w-full mx-auto"
                >
                  {/* Portrait Background Photo */}
                  <img 
                    src={lawyer.image} 
                    alt={lawyer.user?.name} 
                    className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[750ms] ease-out -z-10"
                  />
                  
                  {/* Bottom Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300 -z-10" />

                  {/* Status Pill */}
                  <div className="absolute top-[1rem] left-[1rem] flex items-center gap-[0.375rem] px-[0.625rem] py-[0.3125rem] rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm z-[10] transition-all duration-350 group-hover:left-[1.125rem]">
                    <span className={`h-[0.375rem] w-[0.375rem] rounded-full ${
                      lawyer.status === 'Available' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                    }`} />
                    <span className="text-[0.5rem] font-black uppercase tracking-wider text-white">
                      {lawyer.status}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-[1rem] right-[1rem] px-[0.75rem] py-[0.3125rem] rounded-full bg-accent/90 backdrop-blur-md text-white dark:text-navy text-[0.6875rem] font-black tracking-wide shadow-sm flex items-center gap-[0.125rem] z-[10] transition-all duration-350 group-hover:right-[1.125rem]">
                    <span>${lawyer.rate}</span>
                    <span className="text-[0.5rem] font-medium opacity-80">/hr</span>
                  </div>

                  {/* Floating Information Panel */}
                  <div className="absolute bottom-[1rem] left-[1rem] right-[1rem] backdrop-blur-xl bg-black/60 dark:bg-zinc-950/70 border border-white/10 p-[1.125rem] rounded-[1.5rem] transition-all duration-500 ease-out z-[10] shadow-[0_1rem_2rem_rgba(0,0,0,0.3)] group-hover:bottom-[1.125rem] group-hover:left-[0.875rem] group-hover:right-[0.875rem]">
                    <span className="text-[0.5625rem] uppercase tracking-widest text-accent font-black block mb-[0.125rem]">
                      {lawyer.specialization}
                    </span>
                    
                    <div className="flex items-center gap-[0.5rem] flex-wrap">
                      <h4 className="font-serif font-bold text-[1.25rem] tracking-tight text-white group-hover:text-accent transition-colors duration-[300ms] line-clamp-1 leading-snug">
                        {lawyer.user?.name}
                      </h4>
                      {lawyer.badge && (
                        <span className="inline-flex items-center gap-[0.125rem] text-[0.5rem] uppercase tracking-widest text-amber-400 font-extrabold bg-amber-400/10 px-[0.375rem] py-[0.125rem] rounded">
                          ★ {lawyer.badge.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-[0.25rem] text-[0.75rem] mt-[0.375rem]">
                      <span className="text-amber-400 text-[0.875rem]">★</span>
                      <span className="font-bold text-white/90">{lawyer.ratingAverage?.toFixed(1) || '5.0'}</span>
                      <span className="text-white/60">({lawyer.reviewsCount || 0} reviews)</span>
                    </div>

                    {/* Sliding Action Button on Hover */}
                    <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-[3rem] group-hover:opacity-100 group-hover:mt-[0.875rem]">
                      <Link
                        href={`/lawyers/${lawyer._id}`}
                        className="w-full py-[0.625rem] rounded-[0.75rem] bg-accent text-white dark:text-navy font-bold text-[0.725rem] uppercase tracking-widest flex items-center justify-center gap-[0.5rem] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent/10"
                      >
                        <span>View Profile</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Extra Section 1: Top Legal Experts */}
      <section className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10 bg-slate-50/50 dark:bg-zinc-950/20">
        <div className="editorial-container">
          <div className="text-center space-y-[0.5rem] mb-[4rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Highly Recruited</span>
            <h2 className="font-serif text-[2.25rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground">Top Legal Experts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] w-full">
            {loading ? (
              [1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-center gap-[1.5rem] p-[1.5rem] bg-card/60 dark:bg-zinc-900/40 border border-border/50 rounded-[1.5rem] animate-pulse w-full max-w-[28rem] md:max-w-none mx-auto">
                  <div className="h-[5rem] w-[5rem] rounded-full bg-slate-200 dark:bg-zinc-800 flex-shrink-0" />
                  <div className="space-y-[0.5rem] flex-1">
                    <div className="h-[1.25rem] bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-[0.6875rem] bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                    <div className="flex gap-[0.5rem] pt-[0.25rem]">
                      <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
                      <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              topExperts.map((expert, idx) => (
                <Link
                  href={`/lawyers/${expert._id}`}
                  key={expert._id}
                  className="relative flex items-center gap-[1.5rem] p-[1.5rem] bg-card/60 dark:bg-zinc-900/30 backdrop-blur-md border border-border/50 rounded-[1.5rem] hover:-translate-y-1 hover:border-accent/40 hover:bg-card hover:shadow-[0_1rem_2.5rem_rgba(169,132,76,0.06)] dark:hover:shadow-[0_1rem_2.5rem_rgba(0,0,0,0.4)] transition-all duration-[400ms] group cursor-pointer w-full mx-auto max-w-[28rem] md:max-w-none"
                >
                  {/* Rank Badge */}
                  <span className="absolute top-[1.125rem] right-[1.125rem] font-mono text-[0.6875rem] font-black text-accent/50 group-hover:text-accent transition-colors duration-300">
                    #0{idx + 1}
                  </span>

                  {/* Circular Avatar with Accent Ring */}
                  <div className="relative h-[5rem] w-[5rem] flex-shrink-0 rounded-full overflow-hidden border-[0.125rem] border-accent/20 group-hover:border-accent transition-colors duration-500 shadow-sm">
                    <img
                      src={expert.image}
                      alt={expert.user?.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content details */}
                  <div className="space-y-[0.375rem] flex-1 min-w-[0rem]">
                    <h4 className="font-serif font-bold text-[1.125rem] text-primary dark:text-foreground group-hover:text-accent transition-colors line-clamp-1">
                      {expert.user?.name}
                    </h4>
                    <p className="text-[0.625rem] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">
                      {expert.specialization}
                    </p>
                    
                    {/* Tags row */}
                    <div className="flex items-center gap-[0.375rem] flex-wrap pt-[0.25rem]">
                      <span className="inline-flex items-center gap-[0.125rem] bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[0.625rem] font-black tracking-wider px-[0.5rem] py-[0.1875rem] rounded">
                        <span>★</span>
                        <span>{expert.ratingAverage?.toFixed(1) || '5.0'}</span>
                      </span>
                      <span className="bg-accent/10 text-accent text-[0.625rem] font-black tracking-wider px-[0.5rem] py-[0.1875rem] rounded">
                        {expert.reviewsCount || 0} reviews
                      </span>
                    </div>
                  </div>

                  {/* Sliding Arrow link */}
                  <span className="absolute bottom-[1rem] right-[1.25rem] text-accent transform translate-x-[-0.25rem] group-hover:translate-x-[0rem] transition-all duration-300 opacity-0 group-hover:opacity-100 font-bold text-[0.875rem]">
                    →
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Extra Section: Trust & Escrow Setup */}
      <section id="trust" className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[5rem] md:py-[6.5rem] z-[10] border-t-[0.0625rem] border-border/10 bg-transparent">
        <div className="editorial-container">
          <div className="text-center space-y-[0.5rem] mb-[5rem]">
            <span className="text-[0.625rem] uppercase tracking-[0.25em] text-accent font-extrabold block">Secure Marketplace</span>
            <h2 className="font-serif text-[2.25rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground">Built on Trust & Security</h2>
            <div className="h-[0.0625rem] w-[3.5rem] bg-accent/30 mx-auto mt-[1.5rem]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                title: '100% Verified Credentials',
                desc: 'Every attorney undergoes a strict background check, bar registration authentication, and license check.',
                icon: (
                  <svg className="w-[2.25rem] h-[2.25rem] text-accent transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                )
              },
              {
                title: 'Secure Stripe Escrow',
                desc: 'Funds are securely locked in escrow. The lawyer is paid only after they accept and complete your consultation.',
                icon: (
                  <svg className="w-[2.25rem] h-[2.25rem] text-accent transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                )
              },
              {
                title: 'Confidential Counsel',
                desc: 'Premium security protocols protect all communications, comments, files, and consultation history.',
                icon: (
                  <svg className="w-[2.25rem] h-[2.25rem] text-accent transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-start p-[2.5rem] border-b md:border-b-0 md:border-r border-border/10 last:border-b-0 last:border-r-0 transition-all duration-[450ms] select-none"
              >
                {/* Float-up Icon */}
                <div className="mb-[1.75rem] flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Subtitle / Numbering */}
                <span className="font-serif italic text-[0.875rem] text-accent/60 block mb-[0.375rem] transition-colors duration-300 group-hover:text-accent">
                  0{i + 1}.
                </span>

                {/* Title */}
                <h3 className="font-serif font-bold text-[1.45rem] tracking-tight text-primary dark:text-foreground transition-colors duration-300 group-hover:text-accent">
                  {item.title}
                </h3>

                {/* Expanding divider line */}
                <div className="w-[2rem] h-[0.0625rem] bg-accent/30 my-[1.25rem] group-hover:w-[4rem] group-hover:bg-accent/70 transition-all duration-500 ease-out" />

                {/* Description */}
                <p className="text-[0.875rem] text-slate-500 dark:text-zinc-400 leading-relaxed font-body">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
