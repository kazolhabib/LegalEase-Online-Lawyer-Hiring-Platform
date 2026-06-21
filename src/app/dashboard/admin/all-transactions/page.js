'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AdminAllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        setError('Failed to fetch transaction logs.');
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Connection failed. Could not load audit log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const transactionsTimer = setTimeout(() => {
      fetchTransactions();
    }, 0);

    return () => clearTimeout(transactionsTimer);
  }, []);

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">All Transactions</h2>
        <p className="text-[0.75rem] text-slate-500">Audit logs of successful payments collected on the platform.</p>
      </div>

      {error && (
        <div className="p-[0.875rem] text-[0.75rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[0.5rem] font-medium text-center max-w-[42rem]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-[0.75rem]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[3.5rem] bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-[0.5rem]" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          No payment transactions logged in the database yet.
        </div>
      ) : (
        <div className="space-y-[1rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] lg:hidden">
            {transactions.map((tx) => (
              <article
                key={tx._id}
                className="w-full rounded-[1rem] border border-border/15 bg-background/25 p-[1rem] space-y-[1rem]"
              >
                <div className="flex items-start justify-between gap-[1rem]">
                  <div className="min-w-0 space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Transaction ID</p>
                    <p className="font-mono text-[0.75rem] font-bold text-foreground break-all">{tx.transactionId}</p>
                  </div>
                  <p className="shrink-0 font-extrabold text-accent text-[1rem]">${tx.amount}</p>
                </div>

                <div className="grid grid-cols-1 gap-[0.75rem] text-[0.75rem]">
                  <div className="space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Client Email</p>
                    <p className="text-slate-500 font-medium break-all">{tx.clientEmail}</p>
                  </div>
                  <div className="space-y-[0.25rem]">
                    <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Attorney Email</p>
                    <p className="text-slate-500 font-medium break-all">{tx.lawyerEmail}</p>
                  </div>
                </div>

                <div className="border-t border-border/10 pt-[0.75rem]">
                  <p className="text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Date Settled</p>
                  <p className="text-[0.75rem] text-slate-400 mt-[0.25rem]">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
            <table className="w-full table-fixed text-[0.75rem] text-left border-collapse">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                  <th className="w-[24%] px-[1rem] py-[1rem]">Transaction ID</th>
                  <th className="w-[24%] px-[1rem] py-[1rem]">Client Email</th>
                  <th className="w-[24%] px-[1rem] py-[1rem]">Attorney Email</th>
                  <th className="w-[12%] px-[1rem] py-[1rem]">Amount Paid</th>
                  <th className="w-[16%] px-[1rem] py-[1rem]">Date Settle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-foreground/[0.01] transition-colors">
                    <td className="px-[1rem] py-[1rem] font-mono font-bold text-foreground break-all">
                      {tx.transactionId}
                    </td>
                    <td className="px-[1rem] py-[1rem] text-slate-500 font-medium break-all">{tx.clientEmail}</td>
                    <td className="px-[1rem] py-[1rem] text-slate-500 font-medium break-all">{tx.lawyerEmail}</td>
                    <td className="px-[1rem] py-[1rem] font-extrabold text-accent">${tx.amount}</td>
                    <td className="px-[1rem] py-[1rem] text-slate-400">
                      {new Date(tx.date).toLocaleString()}
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
