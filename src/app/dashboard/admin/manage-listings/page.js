'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AdminManageListingsPage() {
  const [lawyers, setLawyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionId, setActionId] = useState(null);

  const verificationClassName = (isVerified) => (
    isVerified
      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
  );

  const publishClassName = (isPublished) => (
    isPublished
      ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
      : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/25'
  );

  const fetchLawyers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/lawyers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLawyers(data);
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to fetch lawyer listings.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Could not retrieve listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const listingsTimer = setTimeout(() => {
      fetchLawyers();
    }, 0);

    return () => clearTimeout(listingsTimer);
  }, []);

  const handleTogglePublish = async (lawyerId, currentPublishStatus) => {
    setActionId(lawyerId);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/lawyers/${lawyerId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !currentPublishStatus })
      });
      if (res.ok) {
        setSuccess(`Publication status updated successfully!`);
        fetchLawyers();
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to update publication status.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while toggling publication.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteListing = async (lawyerId) => {
    if (!window.confirm('Are you sure you want to permanently delete this lawyer listing? This action cannot be undone.')) {
      return;
    }
    setActionId(lawyerId);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/lawyers/${lawyerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccess('Lawyer profile listing deleted successfully.');
        fetchLawyers();
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to delete listing.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while deleting listing.');
    } finally {
      setActionId(null);
    }
  };

  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Manage Lawyer Listings</h2>
        <p className="text-[0.75rem] text-slate-500">Toggle directory visibility, approve publications, or delete listings.</p>
      </div>

      {success && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center">
          {success}
        </div>
      )}

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center">
          {error}
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-[1rem] justify-between items-center">
        <div className="relative w-full sm:w-[20rem]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or practice area..."
            className="w-full pl-[1rem] pr-[2.5rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none focus:ring-[0.0625rem] focus:ring-accent text-foreground"
          />
        </div>
        <div className="text-[0.6875rem] text-slate-500 font-bold uppercase tracking-wider">
          Total Listings: {filteredLawyers.length}
        </div>
      </div>

      {loading ? (
        <div className="space-y-[0.75rem]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[3.5rem] bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-[0.5rem]" />
          ))}
        </div>
      ) : filteredLawyers.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          No lawyer profiles match your query.
        </div>
      ) : (
        <div className="space-y-[1rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] lg:hidden">
            {filteredLawyers.map((lawyer) => (
              <article
                key={lawyer._id}
                className="w-full rounded-[1rem] border border-border/15 bg-background/25 p-[1rem] space-y-[1rem]"
              >
                <div className="flex items-start gap-[0.875rem]">
                  <img
                    src={lawyer.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=533'}
                    alt={lawyer.user?.name}
                    className="h-[3rem] w-[3rem] object-cover rounded-[0.75rem] border border-border/50 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-[0.25rem]">
                    <h3 className="font-bold text-foreground text-[0.875rem] leading-tight break-words">
                      {lawyer.user?.name}
                    </h3>
                    <p className="text-[0.6875rem] text-slate-500 break-all">{lawyer.user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[0.75rem] text-[0.75rem]">
                  <div className="space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Practice Area</p>
                    <p className="text-slate-400 font-bold break-words">{lawyer.specialization}</p>
                  </div>
                  <div className="space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Rate</p>
                    <p className="font-bold text-accent">${lawyer.rate}/hr</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-[0.5rem]">
                  <span className={`inline-block px-[0.5rem] py-[0.1875rem] rounded-full text-[0.5625rem] font-black uppercase tracking-wider ${verificationClassName(lawyer.isVerified)}`}>
                    {lawyer.isVerified ? 'Verified' : 'Pending Fee'}
                  </span>
                  <span className={`inline-block px-[0.5rem] py-[0.1875rem] rounded-full text-[0.5625rem] font-black uppercase tracking-wider ${publishClassName(lawyer.isPublished)}`}>
                    {lawyer.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-[0.625rem] pt-[0.25rem]">
                  <button
                    onClick={() => handleTogglePublish(lawyer._id, lawyer.isPublished)}
                    disabled={actionId !== null}
                    className={`px-[0.75rem] py-[0.625rem] text-[0.625rem] font-bold rounded-[0.5rem] transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50 border ${
                      lawyer.isPublished
                        ? 'text-zinc-400 border-zinc-500/20 hover:bg-zinc-500 hover:text-white'
                        : 'text-indigo-500 border-indigo-500/20 hover:bg-indigo-500 hover:text-white'
                    }`}
                  >
                    {lawyer.isPublished ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDeleteListing(lawyer._id)}
                    disabled={actionId !== null}
                    className="px-[0.75rem] py-[0.625rem] text-[0.625rem] font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-[0.5rem] transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
            <table className="w-full table-fixed text-[0.75rem] text-left border-collapse">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                  <th className="w-[26%] px-[1rem] py-[1rem]">Attorney</th>
                  <th className="w-[18%] px-[1rem] py-[1rem]">Practice Area</th>
                  <th className="w-[13%] px-[1rem] py-[1rem]">Consulting Rate</th>
                  <th className="w-[14%] px-[1rem] py-[1rem]">Vetting Status</th>
                  <th className="w-[14%] px-[1rem] py-[1rem]">Directory Visibility</th>
                  <th className="w-[15%] px-[1rem] py-[1rem] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {filteredLawyers.map((lawyer) => (
                  <tr key={lawyer._id} className="hover:bg-foreground/[0.01] transition-colors">
                    <td className="px-[1rem] py-[1rem]">
                      <div className="flex items-center gap-[0.75rem] min-w-0">
                        <img
                          src={lawyer.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=533'}
                          alt={lawyer.user?.name}
                          className="h-[2.25rem] w-[2.25rem] object-cover rounded-[0.5rem] border border-border/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-foreground block break-words">{lawyer.user?.name}</span>
                          <span className="text-[0.625rem] text-slate-500 block break-all">{lawyer.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-[1rem] py-[1rem] text-slate-500 font-medium break-words">{lawyer.specialization}</td>
                    <td className="px-[1rem] py-[1rem] font-bold text-accent">${lawyer.rate}/hr</td>
                    <td className="px-[1rem] py-[1rem]">
                      <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.5625rem] font-black uppercase tracking-wider ${verificationClassName(lawyer.isVerified)}`}>
                        {lawyer.isVerified ? 'Verified' : 'Pending Fee'}
                      </span>
                    </td>
                    <td className="px-[1rem] py-[1rem]">
                      <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.5625rem] font-black uppercase tracking-wider ${publishClassName(lawyer.isPublished)}`}>
                        {lawyer.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-[1rem] py-[1rem]">
                      <div className="flex flex-wrap items-center justify-end gap-[0.5rem]">
                        <button
                          onClick={() => handleTogglePublish(lawyer._id, lawyer.isPublished)}
                          disabled={actionId !== null}
                          className={`px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold rounded transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50 border ${
                            lawyer.isPublished
                              ? 'text-zinc-400 border-zinc-500/20 hover:bg-zinc-500 hover:text-white'
                              : 'text-indigo-500 border-indigo-500/20 hover:bg-indigo-500 hover:text-white'
                          }`}
                        >
                          {lawyer.isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        <button
                          onClick={() => handleDeleteListing(lawyer._id)}
                          disabled={actionId !== null}
                          className="px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
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
