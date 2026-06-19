'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function UserHiringHistoryPage() {
  const searchParams = useSearchParams();
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch hiring history
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/hires/client`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHires(data);
      } else {
        setError('Failed to fetch hiring requests.');
      }
    } catch (err) {
      console.error('Failed to load hires:', err);
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Check for payment status in URL query
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setSuccessMsg('Stripe payment confirmed successfully! Your booking is locked.');
    } else if (payment === 'cancelled') {
      setError('Stripe payment transaction was cancelled.');
    }
  }, [searchParams]);

  // Handle Mock Pay
  const handleMockPay = async (hireId) => {
    setProcessingId(hireId);
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payments/mock-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hireId })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Mock Payment processed successfully! Transaction logged.');
        fetchHistory(); // refresh list
      } else {
        setError(data.msg || 'Mock payment failed.');
      }
    } catch (err) {
      console.error('Mock pay error:', err);
      setError('Connection failure during payment processing.');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Stripe Checkout Pay
  const handleStripePay = async (hireId) => {
    setProcessingId(hireId);
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hireId })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe checkout
        } else {
          setError('Failed to generate Stripe session url.');
        }
      } else {
        setError(data.msg || 'Stripe initialization failed.');
      }
    } catch (err) {
      console.error('Stripe pay error:', err);
      setError('Stripe service error. Please try mock pay instead.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Hiring History</h2>
        <p className="text-[0.75rem] text-slate-500">Track and pay your consultation requests.</p>
      </div>

      {successMsg && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-[0.75rem]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[3.5rem] bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-[0.5rem]" />
          ))}
        </div>
      ) : hires.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          You have not submitted any legal hiring cases yet.
        </div>
      ) : (
        <div className="w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
          <table className="w-full text-[0.75rem] text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                <th className="px-[1rem] py-[1rem]">Attorney</th>
                <th className="px-[1rem] py-[1rem]">Specialization</th>
                <th className="px-[1rem] py-[1rem]">Fee</th>
                <th className="px-[1rem] py-[1rem]">Request Date</th>
                <th className="px-[1rem] py-[1rem]">Status</th>
                <th className="px-[1rem] py-[1rem] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {hires.map((hire) => (
                <tr key={hire._id} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="px-[1rem] py-[1rem]">
                    <div className="flex items-center gap-[0.75rem]">
                      <img
                        src={hire.lawyer?.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=533'}
                        alt={hire.lawyer?.user?.name}
                        className="h-[2rem] w-[2rem] object-cover rounded-[0.5rem]"
                      />
                      <span className="font-bold text-foreground">{hire.lawyer?.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-[1rem] py-[1rem] text-slate-500 font-medium">{hire.lawyer?.specialization}</td>
                  <td className="px-[1rem] py-[1rem] font-bold text-accent">${hire.fee}</td>
                  <td className="px-[1rem] py-[1rem] text-slate-400">
                    {new Date(hire.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="px-[1rem] py-[1rem]">
                    <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider ${
                      hire.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      hire.status === 'accepted' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
                      hire.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {hire.status}
                    </span>
                  </td>
                  <td className="px-[1rem] py-[1rem] text-right">
                    {hire.status === 'accepted' && (
                      <div className="flex items-center justify-end gap-[0.5rem]">
                        <button
                          onClick={() => handleMockPay(hire._id)}
                          disabled={processingId !== null}
                          className="px-[0.75rem] py-[0.375rem] text-[0.625rem] font-bold bg-accent text-navy hover:scale-105 active:scale-95 transition-all uppercase tracking-wider rounded-[0.375rem] cursor-pointer disabled:opacity-50"
                        >
                          Mock Pay
                        </button>
                        <button
                          onClick={() => handleStripePay(hire._id)}
                          disabled={processingId !== null}
                          className="px-[0.75rem] py-[0.375rem] text-[0.625rem] font-bold bg-primary text-white hover:scale-105 active:scale-95 transition-all uppercase tracking-wider rounded-[0.375rem] cursor-pointer disabled:opacity-50"
                        >
                          Stripe Pay
                        </button>
                      </div>
                    )}
                    {hire.status === 'paid' && (
                      <button
                        disabled
                        className="px-[1rem] py-[0.375rem] text-[0.625rem] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider rounded-[0.375rem] cursor-not-allowed opacity-75"
                      >
                        Paid
                      </button>
                    )}
                    {hire.status === 'pending' && (
                      <span className="text-[0.6875rem] text-slate-400 italic font-medium">Awaiting Lawyer Review</span>
                    )}
                    {hire.status === 'rejected' && (
                      <span className="text-[0.6875rem] text-rose-500/80 italic font-medium">Request Rejected</span>
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
