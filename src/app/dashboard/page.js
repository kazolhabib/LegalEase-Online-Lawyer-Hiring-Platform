'use strict';

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../Providers';

export default function DashboardIndexPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Profile Overview</h2>
        <p className="text-[0.75rem] text-slate-500">Manage your account configurations and personal credentials.</p>
      </div>

      {/* Account Info card layout */}
      <div className="border border-border/80 rounded-[1rem] p-[2rem] bg-background/20 max-w-[32rem] space-y-[1.5rem]">
        <div className="flex items-center gap-[1.5rem]">
          {user.avatar && user.avatar.trim() !== '' && !user.avatar.includes('unsplash.com/photo-1535713875002-d1d0cf377fde') ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-[5rem] w-[5rem] rounded-[1rem] object-cover border border-border"
            />
          ) : (
            <div className="h-[5rem] w-[5rem] rounded-[1rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-[2.5rem] h-[2.5rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          <div>
            <h3 className="font-serif text-[1.5rem] font-bold text-primary dark:text-foreground">{user.name}</h3>
            <p className="text-[0.8125rem] text-slate-500">{user.email}</p>
            <div className="mt-[0.25rem] inline-flex items-center gap-[0.375rem] px-[0.625rem] py-[0.1875rem] bg-accent/10 rounded-full text-[0.625rem] font-bold text-accent uppercase tracking-wider">
              {user.role} Account
            </div>
          </div>
        </div>

        <div className="pt-[1.5rem] border-t border-border/10 grid grid-cols-2 gap-[1rem] text-[0.75rem]">
          <div>
            <p className="text-slate-400 uppercase tracking-wider font-extrabold text-[0.5625rem]">User Identifier</p>
            <p className="font-mono font-medium text-foreground truncate">{user.id || user._id}</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase tracking-wider font-extrabold text-[0.5625rem]">Registration Date</p>
            <p className="font-medium text-foreground">
              {user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="pt-[1rem] flex gap-[1rem]">
          {user.role === 'lawyer' ? (
            <Link
              href="/dashboard/lawyer/manage-legal-profile"
              className="px-[1.5rem] py-[0.5rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.75rem] font-bold rounded-[0.5rem] hover:scale-[1.01] transition-all cursor-pointer text-center flex-1"
            >
              Configure Service Profile
            </Link>
          ) : (
            <Link
              href="/dashboard/user/update-profile"
              className="px-[1.5rem] py-[0.5rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.75rem] font-bold rounded-[0.5rem] hover:scale-[1.01] transition-all cursor-pointer text-center flex-1"
            >
              Update Credentials
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
