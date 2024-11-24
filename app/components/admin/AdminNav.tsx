'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/full-menu', label: 'Full Menu' },
    { href: '/admin/sides', label: 'Sides' },
    { href: '/admin/specials', label: 'Daily Specials' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/menu-content', label: 'Menu Content' },
  ];

  return (
    <nav className="w-full bg-[#2A4E45] shadow-lg rounded-lg overflow-hidden mt-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center flex-wrap md:flex-nowrap">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-6 py-4 text-center transition-all duration-200 whitespace-nowrap',
                  'font-cormorant tracking-wide text-lg md:text-xl',
                  isActive
                    ? 'bg-[#D64C37] text-white font-medium'
                    : 'text-[#F5E6D3] hover:bg-[#2A4E45]/80',
                  'border-r border-[#F5E6D3]/10 last:border-r-0'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
