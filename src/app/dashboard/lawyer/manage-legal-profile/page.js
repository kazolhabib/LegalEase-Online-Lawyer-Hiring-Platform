'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Providers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';

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
  const [profileId, setProfileId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProfileId, setCreatedProfileId] = useState(null);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/lawyers?includeUnpublished=true`);
      if (res.ok) {
        const data = await res.json();
        // Find profile where user matches logged in user ID
        const myProfile = data.lawyers?.find(l => l.user?._id === user.id || l.user?._id === user._id);
        if (myProfile) {
          setProfileId(myProfile._id);
          setBio(myProfile.bio || '');
          setSpecialization(myProfile.specialization || 'Corporate Law');
          setRate(myProfile.rate || '');
          setImage(myProfile.image || '');
          setStatus(myProfile.status || 'Available');
          setBadge(myProfile.badge || 'Rising Star');
          setIsVerified(myProfile.isVerified ?? false);
          setIsPublished(myProfile.isPublished ?? true);
        } else {
          setIsVerified(false);
        }
      }
    } catch (err) {
      console.error('Failed to load lawyer profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current lawyer profile if it exists
  useEffect(() => {
    const profileTimer = setTimeout(() => {
      fetchProfile();
    }, 0);

    return () => clearTimeout(profileTimer);
  }, [user]);

  // Handle URL payment redirect params
  useEffect(() => {
    const paymentTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const payment = urlParams.get('payment');
        if (payment === 'success') {
          setSuccess('Stripe verification payment successful! Welcome to LegalEase.');
          fetchProfile();
        } else if (payment === 'cancelled') {
          setError('Stripe payment was cancelled. Please try again.');
        }
      }
    }, 0);

    return () => clearTimeout(paymentTimer);
  }, []);

  // imgBB Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiKey = IMGBB_API_KEY || '44ab28a8a2352b2a2d1afc1f09e68bda';
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImage(data.data.display_url);
        setSuccess('Image uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('imgBB upload failed:', data);
        setError(`Image upload failed: ${data.error?.message || 'Check your API Key.'}`);
      }
    } catch (err) {
      console.error('imgBB upload error:', err);
      setError('Image upload service error. You can paste a direct URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handlePayVerifyStripe = async () => {
    setPaying(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payments/create-verification-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError('Stripe payment URL could not be generated.');
        }
      } else {
        setError(data.msg || 'Stripe verification session generation failed.');
      }
    } catch (err) {
      console.error('Stripe verify error:', err);
      setError('Stripe service error. Please use Mock Payment option.');
    } finally {
      setPaying(false);
    }
  };

  const handlePayVerifyMock = async () => {
    setPaying(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payments/mock-pay-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Mock payment successful! Profile verified.');
        setIsVerified(true);
        setIsPublished(true);
        fetchProfile();
      } else {
        setError(data.msg || 'Mock payment verification failed.');
      }
    } catch (err) {
      console.error('Mock verify error:', err);
      setError('Connection failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

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
          badge,
          isPublished
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProfileId(data._id);
        setCreatedProfileId(data._id);
        setShowSuccessModal(true);
        setSuccess('');
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

  const handleDeleteProfile = async () => {
    if (!profileId) return;
    if (!window.confirm('Are you sure you want to permanently delete your legal profile? This will remove your listing from the platform.')) {
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/lawyers/${profileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccess('Profile deleted successfully. You can create a new one anytime.');
        setProfileId(null);
        setBio('');
        setSpecialization('Corporate Law');
        setRate('');
        setImage('');
        setStatus('Available');
        setBadge('Rising Star');
        setIsVerified(false);
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to delete profile.');
      }
    } catch (err) {
      console.error('Delete profile error:', err);
      setError('Server error deleting profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Create Service Listing</h2>
        <p className="text-[0.75rem] text-slate-500">Create and publish the attorney service profile clients will see on the Browse Lawyers page.</p>
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
      ) : !isVerified ? (
        <div className="max-w-[32rem] border border-border/80 rounded-[1.5rem] p-[2.5rem] bg-background/30 text-center space-y-[2rem]">
          <div className="mx-auto h-[4.5rem] w-[4.5rem] rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[2rem]">
            🛡️
          </div>
          
          <div className="space-y-[0.75rem]">
            <h3 className="font-serif text-[1.5rem] font-bold text-primary dark:text-foreground">
              Verify Before Publishing Your Listing
            </h3>
            <p className="text-[0.8125rem] text-slate-500 leading-relaxed">
              To publish your services, accept cases, and consult clients on LegalEase, complete the one-time platform verification first. After verification, you can add your practice area, fee, image, and professional bio.
            </p>
          </div>

          <div className="p-[1rem] bg-accent/5 rounded-[1rem] border border-accent/10 flex justify-between items-center text-[0.8125rem]">
            <span className="font-semibold text-slate-600 dark:text-zinc-300">One-time Verification Fee</span>
            <span className="font-serif font-black text-accent text-[1.25rem]">$99.00</span>
          </div>

          <div className="space-y-[0.75rem]">
            <button
              onClick={handlePayVerifyStripe}
              disabled={paying}
              className="w-full py-[0.875rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0.25rem_1rem_rgba(0,0,0,0.05)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-[0.5rem]"
            >
              {paying ? 'Processing...' : '💳 Pay with Stripe'}
            </button>
            
            <button
              onClick={handlePayVerifyMock}
              disabled={paying}
              className="w-full py-[0.875rem] rounded-[0.75rem] border border-border hover:border-accent bg-transparent text-primary dark:text-foreground text-[0.8125rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-[0.5rem]"
            >
              {paying ? 'Processing...' : '⚡ Instantly Verify (Mock Payment)'}
            </button>
          </div>

          <p className="text-[0.625rem] text-slate-400">
            Secure, encrypted payments. By verifying, you agree to our Terms of Practice.
          </p>
        </div>
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

          {/* Image Upload Section */}
          <div className="space-y-[0.5rem]">
            <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Profile Image (imgBB Upload)</label>
            
            <div className="flex items-center gap-[0.75rem]">
              <label
                className={`flex-shrink-0 px-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.6875rem] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  uploading
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-wait'
                    : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-navy'
                }`}
              >
                {uploading ? 'Uploading...' : '📁 Choose Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <span className="text-[0.625rem] text-slate-400">or paste URL below</span>
            </div>

            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Paste direct image link (e.g. from imgBB or Unsplash)"
              required
              className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
            />

            {/* Image Preview */}
            {image && (
              <div className="mt-[0.5rem]">
                <img
                  src={image}
                  alt="Profile Preview"
                  className="h-[6rem] w-[4.5rem] object-cover rounded-[0.5rem] border border-border/50"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
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

          {/* Publish / Unpublish Toggle Switch */}
          <div className="flex items-center gap-[0.75rem] p-[1rem] border border-border/60 bg-background/20 rounded-[0.75rem]">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-[1rem] w-[1rem] accent-accent rounded focus:ring-accent"
            />
            <div className="text-left">
              <label htmlFor="isPublished" className="text-[0.75rem] font-bold text-primary dark:text-foreground cursor-pointer block">
                Publish Listing
              </label>
              <span className="text-[0.625rem] text-slate-500 block">
                Make your professional profile visible in the public browse directory.
              </span>
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
              disabled={submitting || uploading}
              className="w-full py-[0.75rem] rounded-[0.75rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0.25rem_1rem_rgba(0,0,0,0.05)] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Save Profile'}
            </button>
          </div>

          {/* Delete Profile Button */}
          {profileId && (
            <div className="pt-[1.5rem] border-t border-border/10">
              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={submitting}
                className="w-full py-[0.625rem] rounded-[0.75rem] border border-red-500/20 text-red-500 text-[0.75rem] font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                Delete Legal Profile Permanently
              </button>
            </div>
          )}

        </form>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-[1rem] bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-[30rem] rounded-[1.5rem] border border-accent/20 bg-card dark:bg-zinc-950 p-[2rem] text-center shadow-[0_2rem_5rem_rgba(0,0,0,0.35)]">
            <div className="mx-auto mb-[1.25rem] flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <svg className="h-[2rem] w-[2rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75 10.5 18.75 19.5 5.25" />
              </svg>
            </div>

            <span className="text-[0.625rem] uppercase tracking-[0.25em] text-accent font-extrabold">Listing Published</span>
            <h3 className="mt-[0.5rem] font-serif text-[2rem] font-bold text-primary dark:text-foreground">
              Service profile created successfully
            </h3>
            <p className="mt-[0.75rem] text-[0.8125rem] leading-relaxed text-slate-500">
              Your attorney service listing is ready for clients to discover on the Browse Lawyers page.
            </p>

            <div className="mt-[1.75rem] grid grid-cols-1 sm:grid-cols-2 gap-[0.75rem]">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="rounded-[0.75rem] border border-border px-[1rem] py-[0.75rem] text-[0.75rem] font-bold text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
              >
                Keep Editing
              </button>
              <Link
                href={`/browse?highlight=${createdProfileId || profileId}`}
                className="rounded-[0.75rem] bg-primary px-[1rem] py-[0.75rem] text-[0.75rem] font-bold text-white hover:scale-[1.01] transition-all dark:bg-accent dark:text-navy"
              >
                View Your Service Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
