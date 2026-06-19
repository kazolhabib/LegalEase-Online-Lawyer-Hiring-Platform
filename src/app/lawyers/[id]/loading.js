'use client';

import React from 'react';

export default function LawyerDetailLoading() {
  return (
    <div className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[3rem] editorial-container">
      <div className="flex flex-col lg:flex-row gap-[3rem] animate-pulse">
        <div className="w-full lg:w-[22rem] flex-shrink-0 space-y-[1.5rem]">
          <div className="aspect-[3/4] bg-slate-200 dark:bg-zinc-800 rounded-[1rem]" />
          <div className="h-[2rem] bg-slate-200 dark:bg-zinc-800 w-3/4 rounded" />
          <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-1/2 rounded" />
        </div>
        <div className="flex-grow space-y-[2rem]">
          <div className="h-[2rem] bg-slate-200 dark:bg-zinc-800 w-2/3 rounded" />
          <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-full rounded" />
          <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-5/6 rounded" />
          <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-4/5 rounded" />
          <div className="h-[8rem] bg-slate-200 dark:bg-zinc-800 w-full rounded-[1rem]" />
        </div>
      </div>
    </div>
  );
}
