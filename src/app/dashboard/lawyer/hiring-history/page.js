'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function LawyerHiringHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [needsProfile, setNeedsProfile] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const statusClassName = (status) => (
    status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
    status === 'accepted' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
    status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
  );

  const renderClientAvatar = (request, sizeClass = 'h-[2rem] w-[2rem]') => (
    request.client?.avatar && !request.client.avatar.includes('unsplash.com/photo-1535713875002-d1d0cf377fde') ? (
      <img
        src={request.client.avatar}
        alt={request.client.name}
        className={`${sizeClass} object-cover rounded-[0.5rem] shrink-0`}
      />
    ) : (
      <div className={`${sizeClass} rounded-[0.5rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0`}>
        <svg className="w-[1rem] h-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    )
  );

  const renderRequestActions = (request, align = 'left') => {
    if (request.status === 'pending') {
      return (
        <div className={`grid grid-cols-2 gap-[0.625rem] ${align === 'right' ? 'lg:flex lg:justify-end' : ''}`}>
          <button
            onClick={() => handleStatusUpdate(request._id, 'rejected')}
            disabled={processingId !== null}
            className="px-[0.75rem] py-[0.625rem] text-[0.625rem] font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-[0.5rem] transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={() => handleStatusUpdate(request._id, 'accepted')}
            disabled={processingId !== null}
            className="px-[0.75rem] py-[0.625rem] text-[0.625rem] font-bold text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-[0.5rem] transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      );
    }

    if (request.status === 'accepted') {
      return <span className="text-[0.6875rem] text-indigo-500 font-bold italic">Awaiting Client Payment</span>;
    }

    if (request.status === 'rejected') {
      return <span className="text-[0.6875rem] text-slate-400 italic">Request Rejected</span>;
    }

    if (request.status === 'paid') {
      return (
        <div className={align === 'right' ? 'lg:text-right' : ''}>
          <span className="text-[0.6875rem] text-emerald-500 font-bold block">Booking Confirmed & Paid</span>
          {request.transactionId && (
            <span className="text-[0.5625rem] font-mono text-slate-400 block break-all">
              TX: {request.transactionId}
            </span>
          )}
          {request.datePaid && (
            <span className="text-[0.5625rem] text-slate-400 block">
              Settled: {new Date(request.datePaid).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    }

    return null;
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    setNeedsProfile(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/hires/lawyer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        const data = await res.json().catch(() => ({}));
        const message = data.msg || data.message || '';
        if (res.status === 404 || /profile|lawyer|listing|not found/i.test(message)) {
          setNeedsProfile(true);
          setRequests([]);
        } else {
          setError(message || 'Failed to fetch your consultation requests.');
        }
      }
    } catch (err) {
      console.error('Failed to load lawyer hires:', err);
      setError('Connection failed. Could not retrieve hiring list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const requestsTimer = setTimeout(() => {
      fetchRequests();
    }, 0);

    return () => clearTimeout(requestsTimer);
  }, []);

  const handleStatusUpdate = async (requestId, nextStatus) => {
    setProcessingId(requestId);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/hires/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Hiring request successfully ${nextStatus}!`);
        fetchRequests(); // refresh list
      } else {
        setError(data.msg || `Failed to update request to ${nextStatus}.`);
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError('Server connection error. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Inbound Consultations</h2>
        <p className="text-[0.75rem] text-slate-500">Accept or reject hiring requests sent by clients.</p>
      </div>

      {success && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center max-w-[36rem]">
          {success}
        </div>
      )}

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center max-w-[36rem]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-[0.75rem]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[3.5rem] bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-[0.5rem]" />
          ))}
        </div>
      ) : needsProfile ? (
        <div className="max-w-[40rem] rounded-[1.25rem] border border-accent/20 bg-accent/[0.06] p-[1.5rem] sm:p-[2rem] space-y-[1.25rem]">
          <div className="flex items-start gap-[1rem]">
            <div className="h-[3rem] w-[3rem] rounded-[0.875rem] bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
              <svg className="h-[1.5rem] w-[1.5rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </div>
            <div className="space-y-[0.5rem]">
              <h3 className="font-serif text-[1.5rem] font-bold text-primary dark:text-foreground">
                Create your public service listing first
              </h3>
              <p className="text-[0.8125rem] text-slate-500 leading-relaxed">
                Clients can hire you only after your attorney profile is configured and published. Add your practice area, hourly fee, professional bio, and profile image so your service appears on the Browse Lawyers page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[0.75rem] text-[0.6875rem]">
            {['Verify profile', 'Add service details', 'Publish listing'].map((step, index) => (
              <div key={step} className="rounded-[0.75rem] border border-border/40 bg-background/30 p-[0.875rem]">
                <span className="font-serif italic text-accent/70">0{index + 1}.</span>
                <p className="mt-[0.25rem] font-bold text-foreground">{step}</p>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/lawyer/manage-legal-profile"
            className="inline-flex items-center justify-center rounded-[0.75rem] bg-primary px-[1.25rem] py-[0.75rem] text-[0.75rem] font-bold text-white transition-all hover:scale-[1.01] dark:bg-accent dark:text-navy"
          >
            Create Service Listing
          </Link>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          You have not received any legal hiring requests yet.
        </div>
      ) : (
        <div className="space-y-[1rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] lg:hidden">
            {requests.map((request) => (
              <article
                key={request._id}
                className="w-full rounded-[1rem] border border-border/15 bg-background/25 p-[1rem] space-y-[1rem]"
              >
                <div className="flex items-start gap-[0.875rem]">
                  {renderClientAvatar(request, 'h-[2.75rem] w-[2.75rem]')}
                  <div className="min-w-0 flex-1 space-y-[0.25rem]">
                    <div className="flex flex-wrap items-center gap-[0.5rem]">
                      <h3 className="font-bold text-foreground text-[0.875rem] leading-tight break-words">
                        {request.client?.name}
                      </h3>
                      <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.5625rem] font-extrabold uppercase tracking-wider ${statusClassName(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-slate-500 font-medium break-all">{request.client?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[0.75rem] text-[0.75rem]">
                  <div className="space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Consultation Fee</p>
                    <p className="font-bold text-accent">${request.fee}</p>
                  </div>
                  <div className="space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Request Date</p>
                    <p className="text-slate-400 font-medium">{new Date(request.dateCreated).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-border/10 pt-[0.875rem]">
                  {renderRequestActions(request)}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
            <table className="w-full table-fixed text-[0.75rem] text-left border-collapse">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                  <th className="w-[20%] px-[1rem] py-[1rem]">Client</th>
                  <th className="w-[22%] px-[1rem] py-[1rem]">Contact Email</th>
                  <th className="w-[13%] px-[1rem] py-[1rem]">Consultation Fee</th>
                  <th className="w-[13%] px-[1rem] py-[1rem]">Request Date</th>
                  <th className="w-[12%] px-[1rem] py-[1rem]">Status</th>
                  <th className="w-[20%] px-[1rem] py-[1rem] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-foreground/[0.01] transition-colors">
                    <td className="px-[1rem] py-[1rem]">
                      <div className="flex items-center gap-[0.75rem] min-w-0">
                        {renderClientAvatar(request)}
                        <span className="font-bold text-foreground break-words">{request.client?.name}</span>
                      </div>
                    </td>
                    <td className="px-[1rem] py-[1rem] text-slate-500 font-medium break-all">{request.client?.email}</td>
                    <td className="px-[1rem] py-[1rem] font-bold text-accent">${request.fee}</td>
                    <td className="px-[1rem] py-[1rem] text-slate-400">
                      {new Date(request.dateCreated).toLocaleDateString()}
                    </td>
                    <td className="px-[1rem] py-[1rem]">
                      <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider ${statusClassName(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-[1rem] py-[1rem] text-right">
                      {renderRequestActions(request, 'right')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
