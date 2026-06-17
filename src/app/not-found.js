'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-xl mx-auto">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
        >
          <h1
            className="text-editorial-gradient font-serif leading-none select-none"
            style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
          >
            404
          </h1>
        </motion.div>

        {/* Scale Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <svg
            className="w-16 h-16 text-accent opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold mb-3"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted text-base md:text-lg mb-10 leading-relaxed max-w-md mx-auto"
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been relocated.
          Let&apos;s get you back on track.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-medium rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg"
            style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-card transition-all duration-300"
            style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Lawyers
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
