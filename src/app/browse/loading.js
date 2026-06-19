'use client';

import React from 'react';

export default function BrowseLoading() {
  return (
    <div className="w-full px-[1rem] sm:px-[2rem] lg:px-[3rem] py-[3rem] editorial-container">
      <div className="space-y-[0.5rem] mb-[3rem] text-left">
        <div className="h-[0.75rem] w-[5rem] bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-[2.5rem] w-[18rem] bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-[0.875rem] w-[24rem] bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="flex flex-col lg:flex-row gap-[3rem] items-start">
        <div className="w-full lg:w-[18rem] h-[20rem] bg-slate-100 dark:bg-zinc-900 rounded-[1rem] animate-pulse flex-shrink-0" />
        <div className="flex-grow w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[2.5rem] gap-y-[3.5rem]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="flex flex-col space-y-[1rem] animate-pulse">
              <div className="aspect-[3/4] bg-slate-200 dark:bg-zinc-800" />
              <div className="h-[1rem] bg-slate-200 dark:bg-zinc-800 w-3/4" />
              <div className="h-[0.75rem] bg-slate-200 dark:bg-zinc-800 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
