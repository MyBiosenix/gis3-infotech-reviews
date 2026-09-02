'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, SlidersHorizontal, Bell } from 'lucide-react';
import Avatar from './Avatar';

export default function Topbar({
  title,
  subtitle,
  search,
  onSearchChange,
  badge,
}: {
  title: string;
  subtitle?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  badge?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-6 pt-6 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-dash-border bg-white text-dash-text"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-dash-text">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-dash-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onSearchChange && (
          <div className="flex items-center gap-2 rounded-full border border-dash-border bg-white px-4 py-2">
            <Search size={16} className="text-dash-muted" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-36 bg-transparent text-sm text-dash-text outline-none placeholder:text-dash-muted md:w-52"
            />
            <SlidersHorizontal size={16} className="text-dash-muted" />
          </div>
        )}
        <button
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-dash-border bg-white text-dash-muted"
        >
          <Bell size={17} />
        </button>
        <div className="flex items-center gap-2">
          <Avatar name="Guest User" size={36} />
          <span className="hidden text-sm font-medium text-dash-text md:inline">Guest</span>
        </div>
      </div>
    </div>
  );
}
