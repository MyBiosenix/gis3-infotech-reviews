'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Store, FolderOpen, ClipboardList, PlusCircle, User, Settings } from 'lucide-react';

const ITEMS = [
  { key: 'home', href: '/', icon: Home },
  { key: 'reviews', href: '/reviews', icon: LayoutGrid },
  { key: 'store', href: '#', icon: Store },
  { key: 'folder', href: '#', icon: FolderOpen },
  { key: 'list', href: '#', icon: ClipboardList },
  { key: 'add', href: '/reviews/new', icon: PlusCircle },
  { key: 'profile', href: '#', icon: User },
  { key: 'settings', href: '#', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-16 flex-col items-center gap-2 bg-dash-sidebar py-6">
      <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-amber font-display text-sm font-bold text-court">
        GIS3
      </div>

      {ITEMS.map(({ key, href, icon: Icon }) => {
        const active = href !== '#' && (pathname === href || (href !== '/' && pathname.startsWith(href)));
        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              active ? 'bg-amber text-court' : 'text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
          </Link>
        );
      })}
    </aside>
  );
}
