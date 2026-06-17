'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal / Editing states
  const [editingComment, setEditingComment] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments/my-comments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        setError('Failed to fetch your reviews.');
      }
    } catch (err) {
      console.error('Failed to load my comments:', err);
      setError('Connection failed. Could not retrieve comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) {
      return;
    }
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccessMsg('Review removed successfully.');
        setComments(comments.filter(c => c._id !== commentId));
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to delete review.');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      setError('Server error deleting review.');
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment);
    setEditRating(comment.rating);
    setEditText(comment.text);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) {
      setError('Review comment text cannot be blank.');
      return;
    }
    setUpdating(true);
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments/${editingComment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: editRating,
          text: editText
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Review updated successfully.');
        setEditingComment(null);
        fetchComments(); // refresh list
      } else {
        setError(data.msg || 'Failed to update review.');
      }
    } catch (err) {
      console.error('Update review error:', err);
      setError('Server error updating review.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">My Reviews</h2>
        <p className="text-[0.75rem] text-slate-500">Edit or delete feedback comments left on advocate profiles.</p>
      </div>

      {successMsg && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center max-w-[36rem]">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center max-w-[36rem]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-[0.75rem]">
          {[1, 2].map((n) => (
            <div key={n} className="h-[3.5rem] bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-[0.5rem]" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          You have not written any review comments yet.
        </div>
      ) : (
        <div className="w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
          <table className="w-full text-[0.75rem] text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                <th className="px-[1rem] py-[1rem]">Lawyer</th>
                <th className="px-[1rem] py-[1rem]">Rating</th>
                <th className="px-[1rem] py-[1rem]">Review Content</th>
                <th className="px-[1rem] py-[1rem]">Date Published</th>
                <th className="px-[1rem] py-[1rem] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {comments.map((comment) => (
                <tr key={comment._id} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="px-[1rem] py-[1rem]">
                    <span className="font-bold text-foreground">
                      {comment.lawyer?.user?.name || 'Removed Lawyer'}
                    </span>
                  </td>
                  <td className="px-[1rem] py-[1rem]">
                    <span className="text-amber-500 font-bold">
                      {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                    </span>
                  </td>
                  <td className="px-[1rem] py-[1rem] max-w-[15rem] truncate text-slate-500 font-medium">
                    {comment.text}
                  </td>
                  <td className="px-[1rem] py-[1rem] text-slate-400">
                    {new Date(comment.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="px-[1rem] py-[1rem] text-right space-x-[0.5rem]">
                    <button
                      onClick={() => startEdit(comment)}
                      className="px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold text-accent border border-accent/20 rounded hover:bg-accent hover:text-navy cursor-pointer transition-all uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white cursor-pointer transition-all uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingComment && (
        <div className="fixed inset-[0rem] z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-[1rem]">
          <div className="bg-background border border-border w-full max-w-[26rem] rounded-[1rem] shadow-[0_1rem_3rem_rgba(0,0,0,0.2)] overflow-hidden animate-[fadeIn_200ms_ease-out]">
            <div className="px-[1.5rem] py-[1.25rem] border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-[1.25rem] text-primary dark:text-foreground">
                Edit Review
              </h3>
              <button
                onClick={() => setEditingComment(null)}
                className="text-slate-400 hover:text-foreground text-[0.875rem] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-[1.5rem] space-y-[1.25rem]">
              <div className="space-y-[0.375rem]">
                <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Service Rating</label>
                <div className="flex gap-[0.25rem]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="text-[1.5rem] focus:outline-none cursor-pointer"
                    >
                      <span className={star <= editRating ? 'text-amber-500' : 'text-slate-300 dark:text-zinc-700'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-[0.375rem]">
                <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Review Comments</label>
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                  className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent"
                />
              </div>

              <div className="flex gap-[0.75rem] pt-[0.5rem]">
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                  className="w-full py-[0.625rem] border border-border text-foreground text-[0.75rem] font-bold rounded-[0.5rem] hover:bg-foreground/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-[0.625rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.75rem] font-bold rounded-[0.5rem] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
