'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Providers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LawyerManageProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Profile Form States
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('Corporate Law');
  const [rate, setRate] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Available');
  const [badge, setBadge] = useState('Rising Star');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current lawyer profile if it exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/lawyers`);
        if (res.ok) {
          const data = await res.json();
          // Find profile where user matches logged in user ID
          const myProfile = data.lawyers?.find(l => l.user?._id === user.id || l.user?._id === user._id);
          if (myProfile) {
            setBio(myProfile.bio || '');
            setSpecialization(myProfile.specialization || 'Corporate Law');
            setRate(myProfile.rate || '');
            setImage(myProfile.image || '');
            setStatus(myProfile.status || 'Available');
            setBadge(myProfile.badge || 'Rising Star');
          }
        }
      } catch (err) {
        console.error('Failed to load lawyer profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio.trim() || !image.trim() || rate === '') {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/lawyers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio,
          specialization,
          rate: Number(rate),
          image,
          status,
          badge
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Legal profile configured successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(data.msg || 'Failed to submit profile.');
      }
    } catch (err) {
      console.error('Submit lawyer profile error:', err);
      setError('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Manage Legal Profile</h2>
        <p className="text-[0.75rem] text-slate-500">Configure the legal services you provide on the platform.</p>
      </div>

      {success && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center max-w-[32rem]">
          {success}
        </div>
      )}

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center max-w-[32rem]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-spin rounded-full h-[1.5rem] w-[1.5rem] border-b-[0.125rem] border-accent" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-[1.25rem] max-w-[32rem]">
          
          <div className="space-y-[0.375rem]">
            <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Practice Area / Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none text-foreground"
            >
              <option value="Corporate Law">Corporate Law</option>
              <option value="Criminal Defense">Criminal Defense</option>
              <option value="Family Law">Family Law</option>
              <option value="Intellectual Property">Intellectual Property</option>
              <option value="Civil Litigation">Civil Litigation</option>
              <option value="Tax Consultancy">Tax Consultancy</option>
            </select>
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Hourly Consulting Rate ($)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 150"
              required
              min={0}
              className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
            />
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Profile Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Paste direct image link (e.g. from imgBB or Unsplash)"
              required
              className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-[1rem]">
            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Schedule Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none text-foreground"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
              </select>
            </div>
            
            <div className="space-y-[0.375rem]">
              <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Featured Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none text-foreground"
              >
                <option value="Rising Star">Rising Star</option>
                <option value="Highly Rated">Highly Rated</option>
                <option value="Gold Partner">Gold Partner</option>
                <option value="Trial Expert">Trial Expert</option>
              </select>
            </div>
          </div>

          <div className="space-y-[0.375rem]">
            <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Professional Bio Summary</label>
            <textarea
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summarize your professional qualifications, litigation achievements, bar registrations, and education..."
              required
              className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
            />
          </div>

          <div className="flex gap-[1rem] pt-[0.5rem]">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full py-[0.75rem] border border-border text-foreground text-[0.8125rem] font-bold rounded-[0.75rem] hover:bg-foreground/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-[0.75rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0.25rem_1rem_rgba(0,0,0,0.05)] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Save Profile'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
