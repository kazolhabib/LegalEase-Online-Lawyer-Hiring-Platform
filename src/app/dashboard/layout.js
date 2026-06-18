'use strict';

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../Providers';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-[2rem] w-[2rem] border-b-[0.125rem] border-accent" />
      </div>
    );
  }

  if (!user) {
    return null; // will redirect in useEffect
  }

  // Define sidebar navigation items based on role
  const clientLinks = [
    { name: 'Hiring History', path: '/dashboard/user/hiring-history' },
    { name: 'Update Profile', path: '/dashboard/user/update-profile' },
    { name: 'My Reviews', path: '/dashboard/user/comments' },
  ];

  const lawyerLinks = [
    { name: 'Hiring Requests', path: '/dashboard/lawyer/hiring-history' },
    { name: 'Manage Legal Profile', path: '/dashboard/lawyer/manage-legal-profile' },
  ];

  const adminLinks = [
    { name: 'Manage Users', path: '/dashboard/admin/manage-users' },
    { name: 'All Transactions', path: '/dashboard/admin/all-transactions' },
    { name: 'Platform Analytics', path: '/dashboard/admin/analytics' },
  ];

  const getLinksForRole = () => {
    switch (user.role) {
      case 'lawyer': return lawyerLinks;
      case 'admin': return adminLinks;
      default: return clientLinks;
    }
  };

  const navItems = [
    { name: 'Profile Overview', path: '/dashboard' },
    ...getLinksForRole()
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Ambient Backlight Glows */}
      <div className="absolute top-[10%] left-[-12rem] w-[28rem] h-[28rem] bg-accent/5 dark:bg-accent/[0.03] rounded-full blur-[9rem] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-15rem] w-[35rem] h-[35rem] bg-accent/5 dark:bg-accent/[0.02] rounded-full blur-[11rem] pointer-events-none -z-10" />

      <div className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[3rem] editorial-container flex flex-col md:flex-row gap-[3rem] relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-[15rem] flex-shrink-0 space-y-[2rem]">
          <div className="space-y-[0.5rem] border-b border-border/10 pb-[1.5rem]">
            <h3 className="font-serif text-[1.5rem] font-bold text-primary dark:text-foreground">Console</h3>
            <div className="flex items-center gap-[0.5rem]">
              <span className="h-[0.5rem] w-[0.5rem] bg-accent rounded-full" />
              <span className="text-[0.625rem] uppercase font-bold tracking-widest text-slate-500 capitalize">{user.role} workspace</span>
            </div>
          </div>

          <nav className="flex flex-col gap-[0.25rem]">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`w-full text-left px-[1rem] py-[0.625rem] rounded-[0.5rem] text-[0.75rem] font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white dark:bg-accent dark:text-navy'
                      : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow w-full overflow-x-auto min-h-[50vh]">
          {children}
        </main>

      </div>
    </div>
  );
}
