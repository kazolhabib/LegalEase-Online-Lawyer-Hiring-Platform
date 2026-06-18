'use strict';

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Providers';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(
    user?.avatar && !user.avatar.includes('unsplash.com/photo-1535713875002-d1d0cf377fde')
      ? user.avatar
      : ''
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        setAvatar(data.data.display_url);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full Name is required.');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await updateProfile(name, avatar);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Update Credentials</h2>
        <p className="text-[0.75rem] text-slate-500">Edit your user metadata information.</p>
      </div>

      {success && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center max-w-[28rem]">
          {success}
        </div>
      )}

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center max-w-[28rem]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-[1.25rem] max-w-[28rem]">
        <div className="space-y-[0.375rem]">
          <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
          />
        </div>

        {/* Profile Picture Upload */}
        <div className="space-y-[0.5rem]">
          <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Profile Picture (imgBB Upload)</label>
          
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
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-[1rem] py-[0.75rem] text-[0.8125rem] rounded-[0.75rem] border border-border bg-background/50 focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent text-foreground transition-all"
          />

          {/* Avatar Preview */}
          {avatar ? (
            <div className="mt-[0.5rem] relative inline-block group">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="h-[4rem] w-[4rem] object-cover rounded-[0.75rem] border border-border/50"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setAvatar('')}
                className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors"
                title="Remove photo"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="mt-[0.5rem] h-[4rem] w-[4rem] rounded-[0.75rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-[1.75rem] h-[1.75rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
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
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
