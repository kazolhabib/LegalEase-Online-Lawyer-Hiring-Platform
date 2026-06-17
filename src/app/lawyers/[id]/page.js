'use strict';

'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Providers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LawyerDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const { user } = useAuth();

  // Data States
  const [lawyer, setLawyer] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireMessage, setHireMessage] = useState('');
  const [hireSuccess, setHireSuccess] = useState(false);

  // Review form states
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch lawyer profile
        const profileRes = await fetch(`${API_URL}/lawyers/${id}`);
        if (!profileRes.ok) {
          router.push('/404');
          return;
        }
        const profileData = await profileRes.json();
        setLawyer(profileData);

        // Fetch comments
        const commentsRes = await fetch(`${API_URL}/comments/lawyer/${id}`);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData);
        }
      } catch (err) {
        console.error('Failed to load lawyer details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, router]);

  const handleHireSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'user') {
      setHireMessage('Only Client accounts are permitted to hire legal advocates.');
      return;
    }
    setHiring(true);
    setHireMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/hires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lawyerId: lawyer._id,
          fee: lawyer.rate
        })
      });

      const data = await res.json();
      if (res.ok) {
        setHireSuccess(true);
        setHireMessage('Hiring request submitted successfully! Once the advocate accepts, you can settle the fee in your dashboard.');
        setTimeout(() => {
          setShowHireModal(false);
          router.push('/dashboard/user/hiring-history');
        }, 3000);
      } else {
        setHireMessage(data.msg || 'Hiring request failed. Please try again.');
      }
    } catch (err) {
      console.error('Failed to submit hire request:', err);
      setHireMessage('Server error occurred. Please try again later.');
    } finally {
      setHiring(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setReviewError('Review comment text cannot be blank.');
      return;
    }
    setReviewError('');
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lawyerId: lawyer._id,
          rating,
          text: reviewText
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Append new comment and refresh stats
        setComments([data, ...comments]);
        setReviewText('');
        setRating(5);
        // Refresh lawyer stats rating
        const profileRes = await fetch(`${API_URL}/lawyers/${id}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setLawyer(profileData);
        }
      } else {
        setReviewError(data.msg || 'Failed to submit review. You must have a completed, paid booking with this lawyer to review.');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewError('Server error submitting review. Please try again later.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] editorial-container animate-pulse space-y-[3rem]">
        <div className="flex flex-col md:flex-row gap-[3rem]">
          <div className="w-full md:w-[20rem] aspect-[3/4] bg-slate-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-[1.5rem] py-[1rem]">
            <div className="h-[2rem] bg-slate-200 dark:bg-zinc-800 w-1/3" />
            <div className="h-[3rem] bg-slate-200 dark:bg-zinc-800 w-3/4" />
            <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-1/2" />
            <div className="h-[8rem] bg-slate-200 dark:bg-zinc-800 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[4rem] editorial-container space-y-[4rem]">
      
      {/* Lawyer Profile Section */}
      <div className="flex flex-col md:flex-row gap-[3.5rem] items-start">
        {/* Grayscale portrait image */}
        <div className="w-full md:w-[22rem] aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-border/10 flex-shrink-0">
          <img
            src={lawyer.image}
            alt={lawyer.user?.name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[600ms]"
          />
        </div>

        {/* Details Column */}
        <div className="flex-grow space-y-[1.75rem] text-left">
          <div className="space-y-[0.5rem]">
            <div className="flex items-center gap-[0.75rem]">
              <span className="text-[0.625rem] uppercase tracking-widest text-accent font-bold">
                {lawyer.specialization}
              </span>
              <span className={`h-[0.5rem] w-[0.5rem] rounded-full ${
                lawyer.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
              <span className="text-[0.6875rem] font-semibold text-slate-400 capitalize">
                {lawyer.status}
              </span>
            </div>
            <h1 className="font-serif text-[2.5rem] sm:text-[3.5rem] font-normal tracking-tight text-primary dark:text-foreground italic leading-[1.05]">
              {lawyer.user?.name}
            </h1>
            <p className="text-[0.8125rem] text-slate-400">
              Member since {new Date(lawyer.dateJoined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-[3rem] py-[1rem] border-y border-border/10">
            <div>
              <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Consultation Fee</p>
              <p className="text-[1.5rem] font-extrabold text-accent">${lawyer.rate} <span className="text-[0.875rem] font-medium text-slate-500">/ hour</span></p>
            </div>
            <div>
              <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Reviews Rating</p>
              <div className="flex items-center gap-[0.25rem]">
                <span className="text-amber-500 text-[1.25rem]">★</span>
                <span className="text-[1.5rem] font-extrabold text-foreground">{lawyer.ratingAverage?.toFixed(1) || '5.0'}</span>
                <span className="text-[0.875rem] text-slate-500">({lawyer.reviewsCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-[0.75rem]">
            <h4 className="text-[0.625rem] uppercase tracking-wider font-extrabold text-slate-500">Professional Summary</h4>
            <p className="text-[0.9375rem] leading-relaxed text-slate-500 dark:text-slate-400 whitespace-pre-line max-w-[42rem]">
              {lawyer.bio}
            </p>
          </div>

          <div className="pt-[1rem]">
            {user ? (
              user.role === 'user' ? (
                <button
                  onClick={() => setShowHireModal(true)}
                  className="px-[2.5rem] py-[0.875rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold uppercase tracking-wider rounded-[0.75rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/10 cursor-pointer"
                >
                  Initiate Hiring Case
                </button>
              ) : (
                <div className="text-[0.75rem] text-slate-400 italic">
                  Currently logged in as a {user.role}. Only clients can initiate hiring cases.
                </div>
              )
            ) : (
              <Link
                href="/login"
                className="inline-block px-[2.5rem] py-[0.875rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.8125rem] font-bold uppercase tracking-wider rounded-[0.75rem] hover:scale-[1.02] transition-all cursor-pointer"
              >
                Sign In to Hire Attorney
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Review Comments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[4rem] pt-[4rem] border-t border-border/10">
        
        {/* Comments Feed list */}
        <div className="lg:col-span-2 space-y-[2rem]">
          <h3 className="font-serif text-[1.75rem] font-normal text-primary dark:text-foreground">
            Verified Reviews & Client Feedback ({comments.length})
          </h3>
          
          {comments.length === 0 ? (
            <div className="py-[3rem] text-left text-slate-400 text-[0.8125rem] italic">
              No clients have published feedback reviews for this advocate yet.
            </div>
          ) : (
            <div className="space-y-[1.75rem]">
              {comments.map((comment) => (
                <div key={comment._id} className="pb-[1.5rem] border-b border-border/10 space-y-[0.75rem]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[0.75rem]">
                      <img
                        src={comment.client?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'}
                        alt={comment.client?.name}
                        className="h-[2rem] w-[2rem] rounded-[0.5rem] object-cover"
                      />
                      <div>
                        <p className="text-[0.75rem] font-bold text-foreground leading-tight">{comment.client?.name}</p>
                        <p className="text-[0.5625rem] text-slate-400 leading-none">
                          {new Date(comment.dateCreated).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-amber-500 text-[0.8125rem] font-bold">
                      {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                    </div>
                  </div>
                  <p className="text-[0.8125rem] text-slate-500 dark:text-slate-400 leading-relaxed pl-[2.75rem]">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input form */}
        <div className="space-y-[1.5rem]">
          <h3 className="font-serif text-[1.75rem] font-normal text-primary dark:text-foreground">
            Add Your Review
          </h3>
          
          {user ? (
            user.role === 'user' ? (
              <form onSubmit={handleReviewSubmit} className="space-y-[1rem] p-[1.5rem] border border-border/80 bg-background/20 rounded-[1rem]">
                {reviewError && (
                  <div className="p-[0.75rem] text-[0.6875rem] bg-rose-500/10 text-rose-500 rounded-[0.5rem] text-center font-medium">
                    {reviewError}
                  </div>
                )}

                <div className="space-y-[0.375rem]">
                  <label className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Service Rating</label>
                  <div className="flex gap-[0.25rem]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-[1.5rem] focus:outline-none cursor-pointer transition-transform active:scale-95"
                      >
                        <span className={star <= rating ? 'text-amber-500' : 'text-slate-300 dark:text-zinc-700'}>
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
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your legal consulting experience with this lawyer..."
                    required
                    className="w-full px-[0.75rem] py-[0.5rem] text-[0.75rem] rounded-[0.5rem] border border-border bg-background focus:outline-none focus:ring-[0.0625rem] focus:ring-accent focus:border-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-[0.625rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.75rem] font-bold rounded-[0.5rem] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? 'Publishing...' : 'Publish Feedback'}
                </button>
              </form>
            ) : (
              <div className="p-[1.25rem] border border-border/50 bg-foreground/[0.02] rounded-[1rem] text-left text-[0.75rem] text-slate-400 italic">
                Only client profiles are allowed to publish reviews.
              </div>
            )
          ) : (
            <div className="p-[1.5rem] border border-border/50 bg-foreground/[0.02] rounded-[1rem] text-center space-y-[0.75rem]">
              <p className="text-[0.75rem] text-slate-500">
                You must be signed in to leave a review.
              </p>
              <Link
                href="/login"
                className="inline-block px-[1.25rem] py-[0.5rem] border border-border text-[0.6875rem] font-bold uppercase tracking-wider rounded-[0.5rem] hover:bg-foreground/5 cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Hiring Modal */}
      {showHireModal && (
        <div className="fixed inset-[0rem] z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-[1rem]">
          <div className="bg-background border border-border w-full max-w-[26rem] rounded-[1rem] shadow-[0_1rem_3rem_rgba(0,0,0,0.2)] overflow-hidden animate-[fadeIn_200ms_ease-out]">
            <div className="px-[1.5rem] py-[1.25rem] border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-[1.25rem] text-primary dark:text-foreground">
                Confirm Hiring Case
              </h3>
              <button
                onClick={() => setShowHireModal(false)}
                className="text-slate-400 hover:text-foreground text-[0.875rem] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-[1.5rem] space-y-[1.25rem]">
              {hireMessage && (
                <div className={`p-[0.75rem] text-[0.75rem] rounded-[0.5rem] text-center font-medium ${
                  hireSuccess ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  {hireMessage}
                </div>
              )}

              {!hireSuccess && (
                <>
                  <p className="text-[0.75rem] text-slate-500 leading-relaxed">
                    You are initiating a hiring request for <span className="font-bold text-foreground">{lawyer.user?.name}</span>. 
                    The hourly consultation rate is set at <span className="font-bold text-accent">${lawyer.rate}/hr</span>.
                  </p>
                  
                  <div className="p-[1rem] bg-slate-50 dark:bg-zinc-900 rounded-[0.75rem] space-y-[0.375rem] text-[0.75rem]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Advocate:</span>
                      <span className="font-bold text-foreground">{lawyer.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Specialization:</span>
                      <span className="font-bold text-foreground">{lawyer.specialization}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/10 pt-[0.375rem] mt-[0.375rem]">
                      <span className="text-slate-500">Total Fee:</span>
                      <span className="font-bold text-accent">${lawyer.rate} USD</span>
                    </div>
                  </div>

                  <div className="flex gap-[0.75rem] pt-[0.5rem]">
                    <button
                      onClick={() => setShowHireModal(false)}
                      className="w-full py-[0.625rem] border border-border text-foreground text-[0.75rem] font-bold rounded-[0.5rem] hover:bg-foreground/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleHireSubmit}
                      disabled={hiring}
                      className="w-full py-[0.625rem] bg-primary text-white dark:bg-accent dark:text-navy text-[0.75rem] font-bold rounded-[0.5rem] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {hiring ? 'Submitting...' : 'Confirm Hire'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
