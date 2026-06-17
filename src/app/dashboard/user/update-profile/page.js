'use strict';

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Providers';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

        <div className="space-y-[0.375rem]">
          <label className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Avatar Image URL</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
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
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
