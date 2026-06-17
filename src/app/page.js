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
    { name: 'Corporate Law', count: '124 Lawyers', desc: 'Business formation, mergers, contracts, and IP protection.', icon: '⚖️' },
    { name: 'Criminal Defense', count: '89 Lawyers', desc: 'DUI, felonies, federal offenses, and litigation.', icon: '🛡️' },
    { name: 'Family Law', count: '145 Lawyers', desc: 'Divorce, child custody, adoption, and prenups.', icon: '🏠' },
    { name: 'Intellectual Property', count: '76 Lawyers', desc: 'Patents, trademarks, copyrights, and licensing.', icon: '💡' },
    { name: 'Civil Litigation', count: '112 Lawyers', desc: 'Property disputes, breaches of contract, and injury claims.', icon: '📜' },
    { name: 'Tax Consultancy', count: '54 Lawyers', desc: 'Corporate tax, audits, wealth planning, and IRS disputes.', icon: '💵' },
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
      image: 'https://i.ibb.co.com/mC3p6v0/lawyer-avatar.png',
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
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
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
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
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
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
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
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
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
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
      badge: 'Pro Bono Award'
    }
  ];

  return (
    <div className="relative min-h-screen">
      
      {/* Dynamic Banner Slider Section */}
      <section className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] pt-[2rem] pb-[3rem] relative z-[10]">
        <div className="editorial-container bg-card rounded-[2rem] p-[2rem] sm:p-[4rem] border-[0.0625rem] border-border/80 shadow-[0_0.25rem_2.5rem_rgba(0,0,0,0.015)] relative overflow-hidden min-h-[30rem] flex flex-col md:flex-row items-center justify-between gap-[2rem]">
          
          {/* Slider Content */}
          <div className="max-w-[40rem] space-y-[1.5rem] z-[10] text-left transition-all duration-[700ms]">
            <span className="inline-block px-[0.75rem] py-[0.25rem] rounded-full bg-accent/15 border-[0.0625rem] border-accent/20 text-[0.75rem] text-accent font-semibold uppercase tracking-wider">
              {slides[activeSlide].subtitle}
            </span>
            <h1 className="text-[2.25rem] sm:text-[3.5rem] font-extrabold tracking-tight font-sans leading-[1.1] text-primary dark:text-foreground">
              {slides[activeSlide].title}
            </h1>
            <p className="text-[0.875rem] sm:text-[1rem] text-slate-500 max-w-[32rem] leading-relaxed font-body">
              {slides[activeSlide].description}
            </p>
            <div className="pt-[1rem]">
              <Link
                href={slides[activeSlide].ctaLink}
                className="inline-flex items-center gap-[0.5rem] px-[1.5rem] py-[1rem] rounded-[0.75rem] text-[0.75rem] font-bold bg-primary text-white dark:bg-accent dark:text-navy hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {slides[activeSlide].ctaText}
                <svg className="w-[0.875rem] h-[0.875rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Slider Icon Graphics */}
          <div className="hidden md:flex flex-shrink-0 justify-center items-center h-[12rem] w-[12rem] relative z-[10]">
            <div className="transition-all duration-[700ms] transform hover:rotate-[6deg]">
              {slides[activeSlide].icon}
            </div>
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-[1.5rem] left-[2rem] sm:left-[4rem] flex space-x-[0.5rem] z-[20]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-[0.625rem] rounded-full transition-all duration-[300ms] ${
                  activeSlide === i ? 'w-[2rem] bg-accent' : 'w-[0.625rem] bg-slate-400/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slider Navigation Arrows */}
          <div className="absolute bottom-[1.5rem] right-[2rem] sm:right-[4rem] flex space-x-[0.75rem] z-[20]">
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-[0.625rem] rounded-[0.75rem] border-[0.0625rem] border-border/80 hover:border-accent hover:text-accent transition-all bg-background/50"
              aria-label="Previous slide"
            >
              <svg className="w-[1rem] h-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="p-[0.625rem] rounded-[0.75rem] border-[0.0625rem] border-border/80 hover:border-accent hover:text-accent transition-all bg-background/50"
              aria-label="Next slide"
            >
              <svg className="w-[1rem] h-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* Featured Categories Grid */}
      <section id="categories" className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="text-center space-y-[0.75rem] mb-[3rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Specialized Areas</span>
            <h2 className="text-[1.75rem] sm:text-[2.25rem] font-extrabold font-sans text-primary dark:text-foreground">Explore Legal Specialties</h2>
            <p className="text-[0.75rem] text-slate-500 max-w-[25rem] mx-auto">Select a legal specialty to discover certified lawyers verified for consultations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={`/browse?specialization=${encodeURIComponent(cat.name)}`}
                className="editorial-card p-[1.5rem] rounded-[1.5rem] flex items-start gap-[1rem] group"
              >
                <div className="h-[2.5rem] w-[2.5rem] rounded-[0.75rem] bg-accent/10 border-[0.0625rem] border-accent/25 flex items-center justify-center text-[1.25rem] group-hover:scale-[1.05] transition-transform duration-[300ms]">
                  {cat.icon}
                </div>
                <div className="space-y-[0.25rem] flex-grow">
                  <h4 className="font-bold text-[0.875rem] text-primary dark:text-foreground group-hover:text-accent transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[0.75rem] text-slate-500 leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                  <span className="inline-block text-[0.6875rem] font-bold text-accent uppercase tracking-wider pt-[0.5rem]">
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lawyers Section */}
      <section className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="text-center space-y-[0.75rem] mb-[3rem]">
            <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">Prestigious Representatives</span>
            <h2 className="text-[1.75rem] sm:text-[2.25rem] font-extrabold font-sans text-primary dark:text-foreground">Featured Legal Advocates</h2>
            <p className="text-[0.75rem] text-slate-500 max-w-[25rem] mx-auto">Get consultations and hire certified legal practitioners with proven success records.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]">
            {featuredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="editorial-card rounded-[1.5rem] overflow-hidden flex flex-col justify-between">
                {/* Header Info */}
                <div className="p-[1.5rem] space-y-[1rem]">
                  <div className="flex items-center gap-[1rem]">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={lawyer.image} 
                        alt={lawyer.name} 
                        className="h-[3.5rem] w-[3.5rem] rounded-[1rem] object-cover border-[0.0625rem] border-accent/25"
                      />
                      <span className={`absolute -bottom-[0.25rem] -right-[0.25rem] h-[0.875rem] w-[0.875rem] rounded-full border-[0.125rem] border-card ${
                        lawyer.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                    </div>
                    <div className="space-y-[0.125rem]">
                      <span className="inline-block px-[0.375rem] py-[0.125rem] rounded-[0.25rem] bg-accent/10 border-[0.0625rem] border-accent/20 text-[0.5625rem] text-accent uppercase font-bold tracking-wider leading-none">
                        {lawyer.badge}
                      </span>
                      <h4 className="font-bold text-[0.875rem] text-primary dark:text-foreground line-clamp-1">{lawyer.name}</h4>
                      <p className="text-[0.6875rem] text-slate-500 leading-none">{lawyer.specialization}</p>
                    </div>
                  </div>

                  {/* Rating & Fee */}
                  <div className="flex items-center justify-between pt-[0.75rem] border-t-[0.0625rem] border-border/20 text-[0.75rem]">
                    <div className="flex items-center gap-[0.25rem]">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-foreground">{lawyer.rating}</span>
                      <span className="text-slate-500">({lawyer.reviews} reviews)</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Hourly Fee: </span>
                      <span className="font-extrabold text-accent">${lawyer.rate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-[1.5rem] pb-[1.5rem]">
                  <Link
                    href={`/lawyers/${lawyer.id}`}
                    className="w-full py-[0.625rem] rounded-[0.75rem] font-bold text-[0.625rem] uppercase tracking-wider text-center border-[0.0625rem] border-border/80 hover:bg-accent hover:text-navy hover:border-accent transition-all flex items-center justify-center gap-[0.25rem] bg-background/50"
                  >
                    View Profile
                    <svg className="w-[0.75rem] h-[0.75rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section: Trust & Escrow Setup */}
      <section id="trust" className="relative w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] z-[10] border-t-[0.0625rem] border-border/10">
        <div className="editorial-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
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
              <div key={i} className="editorial-card p-[1.5rem] rounded-[1.5rem] space-y-[0.75rem]">
                <span className="text-[1.5rem] inline-block">{item.icon}</span>
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




