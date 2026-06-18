'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AdminAllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchTransactions();
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
        <div className="w-full border border-border/10 rounded-[1rem] overflow-hidden bg-background/25">
          <table className="w-full text-[0.75rem] text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border/10 text-slate-400 font-extrabold uppercase tracking-wider text-[0.5625rem]">
                <th className="px-[1rem] py-[1rem]">Transaction ID</th>
                <th className="px-[1rem] py-[1rem]">Client Email</th>
                <th className="px-[1rem] py-[1rem]">Attorney Email</th>
                <th className="px-[1rem] py-[1rem]">Amount Paid</th>
                <th className="px-[1rem] py-[1rem]">Date Settle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="px-[1rem] py-[1rem] font-mono font-bold text-foreground">
                    {tx.transactionId}
                  </td>
                  <td className="px-[1rem] py-[1rem] text-slate-500 font-medium">{tx.clientEmail}</td>
                  <td className="px-[1rem] py-[1rem] text-slate-500 font-medium">{tx.lawyerEmail}</td>
                  <td className="px-[1rem] py-[1rem] font-extrabold text-accent">${tx.amount}</td>
                  <td className="px-[1rem] py-[1rem] text-slate-400">
                    {new Date(tx.date).toLocaleString()}
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
