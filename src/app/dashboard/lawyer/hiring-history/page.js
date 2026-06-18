'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function LawyerHiringHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
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
        setError('Failed to fetch your consultation requests.');
      }
    } catch (err) {
      console.error('Failed to load lawyer hires:', err);
      setError('Connection failed. Could not retrieve hiring list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
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
      ) : requests.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          You have not received any legal hiring requests yet.
        </div>
      ) : (
        <div className="w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
          <table className="w-full text-[0.75rem] text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                <th className="px-[1rem] py-[1rem]">Client</th>
                <th className="px-[1rem] py-[1rem]">Contact Email</th>
                <th className="px-[1rem] py-[1rem]">Consultation Fee</th>
                <th className="px-[1rem] py-[1rem]">Request Date</th>
                <th className="px-[1rem] py-[1rem]">Status</th>
                <th className="px-[1rem] py-[1rem] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="px-[1rem] py-[1rem]">
                    <div className="flex items-center gap-[0.75rem]">
                      {request.client?.avatar && !request.client.avatar.includes('unsplash.com/photo-1535713875002-d1d0cf377fde') ? (
                        <img
                          src={request.client.avatar}
                          alt={request.client.name}
                          className="h-[2rem] w-[2rem] object-cover rounded-[0.5rem]"
                        />
                      ) : (
                        <div className="h-[2rem] w-[2rem] rounded-[0.5rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                          <svg className="w-[1rem] h-[1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <span className="font-bold text-foreground">{request.client?.name}</span>
                    </div>
                  </td>
                  <td className="px-[1rem] py-[1rem] text-slate-500 font-medium">{request.client?.email}</td>
                  <td className="px-[1rem] py-[1rem] font-bold text-accent">${request.fee}</td>
                  <td className="px-[1rem] py-[1rem] text-slate-400">
                    {new Date(request.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="px-[1rem] py-[1rem]">
                    <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider ${
                      request.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      request.status === 'accepted' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
                      request.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-[1rem] py-[1rem] text-right">
                    {request.status === 'pending' && (
                      <div className="flex items-center justify-end gap-[0.5rem]">
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          disabled={processingId !== null}
                          className="px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'accepted')}
                          disabled={processingId !== null}
                          className="px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                    {request.status === 'accepted' && (
                      <span className="text-[0.6875rem] text-indigo-500 font-bold italic">Awaiting Client Payment</span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="text-[0.6875rem] text-slate-400 italic">Request Rejected</span>
                    )}
                    {request.status === 'paid' && (
                      <span className="text-[0.6875rem] text-emerald-500 font-bold">Booking Confirmed & Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
