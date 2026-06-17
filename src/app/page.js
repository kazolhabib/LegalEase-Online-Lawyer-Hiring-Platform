'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: 'Corporate Law', count: '124 Lawyers', desc: 'Business formation, mergers, contracts, and IP protection.', icon: '⚖️', num: '01' },
    { name: 'Criminal Defense', count: '89 Lawyers', desc: 'DUI, felonies, federal offenses, and litigation.', icon: '🛡️', num: '02' },
    { name: 'Family Law', count: '145 Lawyers', desc: 'Divorce, child custody, adoption, and prenups.', icon: '🏠', num: '03' },
    { name: 'Intellectual Property', count: '76 Lawyers', desc: 'Patents, trademarks, copyrights, and licensing.', icon: '💡', num: '04' },
    { name: 'Civil Litigation', count: '112 Lawyers', desc: 'Property disputes, breaches of contract, and injury claims.', icon: '📜', num: '05' },
    { name: 'Tax Consultancy', count: '54 Lawyers', desc: 'Corporate tax, audits, wealth planning, and IRS disputes.', icon: '💵', num: '06' },
  ];

  const featuredLawyers = [
    {
      id: 1,
      name: 'Barrister Rafique-ul Huq',
      specialization: 'Corporate & Constitutional Law',
      rate: 150,
      rating: 4.9,
      reviews: 124,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Gold Partner'
    },
    {
      id: 2,
      name: 'Advocate Rokeya Rahman',
      specialization: 'Family & Civil Law',
      rate: 120,
      rating: 4.8,
      reviews: 98,
      status: 'Busy',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Highly Rated'
    },
    {
      id: 3,
      name: 'Dr. Kamal Hossain',
      specialization: 'International Arbitration',
      rate: 250,
      rating: 5.0,
      reviews: 215,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Senior Council'
    },
    {
      id: 4,
      name: 'Advocate Tanjib-ul Alam',
      specialization: 'Telecom & Corporate Law',
      rate: 180,
      rating: 4.7,
      reviews: 82,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Rising Star'
    },
    {
      id: 5,
      name: 'Zakir A. Khan, LL.M.',
      specialization: 'Criminal Litigation',
      rate: 130,
      rating: 4.9,
      reviews: 104,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Trial Expert'
    },
    {
      id: 6,
      name: 'Sara Hossain',
      specialization: 'Human Rights & Labor Law',
      rate: 110,
      rating: 4.9,
      reviews: 147,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=533',
      badge: 'Pro Bono Award'
    }
  ];

  return (
    <div className="relative min-h-screen">
      
      {/* Editorial Banner Section (No Borders, Full Width Text) */}
      <section className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] pt-[3rem] pb-[4rem] relative z-[10]">
        <div className="editorial-container flex flex-col md:flex-row items-center justify-between gap-[3rem]">
          {/* Content */}
          <div className="max-w-[42rem] space-y-[1.5rem] text-left">
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
                {slides[activeSlide].ctaText} &rarr;
              </Link>
            </div>
          </div>

          {/* Large Abstract Icon (No boxed container wrapping) */}
          <div className="hidden md:flex flex-shrink-0 justify-center items-center h-[14rem] w-[14rem] opacity-90">
            {slides[activeSlide].icon}
          </div>
        </div>

        {/* Minimal Control panel (Centered dots & slide numbers) */}
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

      {/* Featured Categories (Borderless Table/Row Layout) */}
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

          {/* List Layout with Thin Horizontal Dividers */}
          <div className="border-t-[0.0625rem] border-border/10">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={`/browse?specialization=${encodeURIComponent(cat.name)}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-[1.5rem] border-b-[0.0625rem] border-border/10 group hover:bg-foreground/[0.01] transition-all px-[0.5rem]"
              >
                <div className="flex items-center gap-[1.5rem]">
                  <span className="text-[0.875rem] font-mono text-accent font-bold">{cat.num}</span>
                  <div className="space-y-[0.125rem]">
                    <h4 className="font-serif font-bold text-[1.125rem] text-primary dark:text-foreground group-hover:text-accent transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 max-w-[35rem] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[1rem] mt-[0.5rem] sm:mt-[0rem]">
                  <span className="text-[0.75rem] font-bold text-foreground/80">{cat.count}</span>
                  <span className="text-accent transform group-hover:translate-x-[0.25rem] transition-transform duration-[200ms]">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lawyers Section (Borderless Clean Grid) */}
      <section className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="text-center space-y-[0.5rem] mb-[4rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Elite Advocates</span>
            <h2 className="font-serif text-[2.25rem] sm:text-[3.25rem] font-normal tracking-tight text-primary dark:text-foreground">Featured Legal Advocates</h2>
          </div>

          {/* Borderless Grid: Image, Text, and Rating Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[4rem] gap-y-[3rem]">
            {featuredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="group flex flex-col">
                {/* Editorial Portrait Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-zinc-900 mb-[1.25rem]">
                  <img 
                    src={lawyer.image} 
                    alt={lawyer.name} 
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[700ms] ease-out"
                  />
                  <span className={`absolute bottom-[1rem] right-[1rem] h-[0.5rem] w-[0.5rem] rounded-full ${
                    lawyer.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <span className="absolute top-[1rem] left-[1rem] px-[0.5rem] py-[0.25rem] bg-accent text-white dark:text-navy text-[0.5625rem] uppercase font-bold tracking-widest">
                    {lawyer.badge}
                  </span>
                </div>

                {/* Info below */}
                <div className="space-y-[0.5rem]">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif font-bold text-[1.25rem] tracking-tight text-primary dark:text-foreground group-hover:text-accent transition-colors duration-[300ms] line-clamp-1">
                      {lawyer.name}
                    </h4>
                    <span className="text-[0.875rem] font-bold text-accent">${lawyer.rate}/hr</span>
                  </div>
                  <p className="text-[0.75rem] uppercase tracking-wider text-slate-500 font-medium">
                    {lawyer.specialization}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between pt-[0.5rem] border-t-[0.0625rem] border-border/10 text-[0.75rem]">
                    <div className="flex items-center gap-[0.25rem]">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-foreground">{lawyer.rating}</span>
                      <span className="text-slate-500">({lawyer.reviews})</span>
                    </div>
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="font-bold text-accent uppercase tracking-wider text-[0.6875rem] pb-[0.125rem] border-b-[0.0625rem] border-transparent hover:border-accent transition-all"
                    >
                      View Profile &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section: Trust & Escrow Setup */}
      <section id="trust" className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3rem]">
            {[
              {
                title: '100% Verified Credentials',
                desc: 'Every attorney undergoes a strict background check, bar registration authentication, and license check.',
                icon: '🛡️'
              },
              {
                title: 'Secure Stripe Escrow',
                desc: 'Funds are securely locked in escrow. The lawyer is paid only after they accept and complete your consultation.',
                icon: '💳'
              },
              {
                title: 'Confidential Counsel',
                desc: 'Premium security protocols protect all communications, comments, files, and consultation history.',
                icon: '🔒'
              }
            ].map((item, i) => (
              <div key={i} className="space-y-[0.75rem]">
                <span className="text-[2.25rem] inline-block">{item.icon}</span>
                <h4 className="font-extrabold text-[0.75rem] uppercase tracking-wider text-primary dark:text-foreground">{item.title}</h4>
                <p className="text-[0.75rem] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}





