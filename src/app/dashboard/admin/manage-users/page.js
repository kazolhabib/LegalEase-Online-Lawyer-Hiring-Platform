'use strict';

'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const roleClassName = (role) => (
    role === 'admin' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
    role === 'lawyer' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
    'bg-slate-500/10 text-slate-500 border border-slate-500/20'
  );

  const renderAvatar = (item, sizeClass = 'h-[2rem] w-[2rem]') => (
    item.avatar && !item.avatar.includes('unsplash.com/photo-1535713875002-d1d0cf377fde') ? (
      <img
        src={item.avatar}
        alt={item.name}
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError('Failed to fetch user list.');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Connection failed. Could not retrieve users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usersTimer = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(usersTimer);
  }, []);

  const handleRoleChange = async (userId, nextRole) => {
    setProcessingId(userId);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.msg || 'User role updated successfully.');
        fetchUsers();
      } else {
        setError(data.msg || 'Failed to update user role.');
      }
    } catch (err) {
      console.error('Role change error:', err);
      setError('Connection failure updating user role.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this user account and all their profiles/bookings? This action cannot be undone.')) {
      return;
    }
    setProcessingId(userId);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.msg || 'User removed successfully.');
        setUsers(users.filter(u => u._id !== userId));
      } else {
        setError(data.msg || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError('Connection error removing user account.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-[2rem]">
      {/* Header */}
      <div className="border-b border-border/10 pb-[1rem]">
        <h2 className="font-serif text-[1.75rem] font-bold text-primary dark:text-foreground">Manage Users</h2>
        <p className="text-[0.75rem] text-slate-500">Edit, change roles, or delete system user accounts.</p>
      </div>

      {success && (
        <div className="p-[0.875rem] text-[0.75rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[0.5rem] font-medium text-center max-w-[42rem]">
          {success}
        </div>
      )}

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
      ) : users.length === 0 ? (
        <div className="text-left text-slate-400 text-[0.8125rem] italic py-[2rem]">
          No users registered in the system.
        </div>
      ) : (
        <div className="space-y-[1rem]">
          <div className="grid grid-cols-1 gap-[1rem] lg:hidden">
            {users.map((item) => (
              <article
                key={item._id}
                className="w-full rounded-[1rem] border border-border/15 bg-background/25 p-[1rem] space-y-[1rem]"
              >
                <div className="flex items-start gap-[0.875rem]">
                  {renderAvatar(item, 'h-[2.75rem] w-[2.75rem]')}
                  <div className="min-w-0 flex-1 space-y-[0.25rem]">
                    <div className="flex flex-wrap items-center gap-[0.5rem]">
                      <h3 className="font-bold text-foreground text-[0.875rem] leading-tight break-words">
                        {item.name}
                      </h3>
                      <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.5625rem] font-extrabold uppercase tracking-wider ${roleClassName(item.role)}`}>
                        {item.role}
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-slate-500 font-medium break-all">{item.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-[0.75rem]">
                  <label className="space-y-[0.375rem]">
                    <span className="block text-[0.5625rem] uppercase tracking-wider font-extrabold text-slate-500">Change Role</span>
                    <select
                      value={item.role}
                      disabled={processingId !== null}
                      onChange={(e) => handleRoleChange(item._id, e.target.value)}
                      className="w-full px-[0.75rem] py-[0.625rem] text-[0.75rem] font-bold rounded-[0.5rem] border border-border bg-background text-foreground focus:outline-none disabled:opacity-50"
                    >
                      <option value="user">User/Client</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <button
                    onClick={() => handleDeleteUser(item._id)}
                    disabled={processingId !== null}
                    className="w-full sm:w-auto self-end px-[1rem] py-[0.625rem] text-[0.625rem] font-bold text-red-500 border border-red-500/20 rounded-[0.5rem] hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
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
                  <th className="w-[28%] px-[1rem] py-[1rem]">User</th>
                  <th className="w-[32%] px-[1rem] py-[1rem]">Email</th>
                  <th className="w-[16%] px-[1rem] py-[1rem]">Current Role</th>
                  <th className="w-[24%] px-[1rem] py-[1rem] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-foreground/[0.01] transition-colors">
                    <td className="px-[1rem] py-[1rem]">
                      <div className="flex items-center gap-[0.75rem] min-w-0">
                        {renderAvatar(item)}
                        <span className="font-bold text-foreground break-words">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-[1rem] py-[1rem] text-slate-500 font-medium break-all">{item.email}</td>
                    <td className="px-[1rem] py-[1rem]">
                      <span className={`inline-block px-[0.5rem] py-[0.125rem] rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider ${roleClassName(item.role)}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-[1rem] py-[1rem]">
                      <div className="flex items-center justify-end gap-[0.5rem]">
                        <select
                          value={item.role}
                          disabled={processingId !== null}
                          onChange={(e) => handleRoleChange(item._id, e.target.value)}
                          className="max-w-[7.5rem] px-[0.5rem] py-[0.25rem] text-[0.6875rem] font-bold rounded border border-border bg-background text-foreground focus:outline-none"
                        >
                          <option value="user">User/Client</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="admin">Admin</option>
                        </select>
                        
                        <button
                          onClick={() => handleDeleteUser(item._id)}
                          disabled={processingId !== null}
                          className="px-[0.5rem] py-[0.25rem] text-[0.625rem] font-bold text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
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
