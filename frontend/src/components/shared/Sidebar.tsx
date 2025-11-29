'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaUsers, FaCog, FaFileAlt } from 'react-icons/fa';

export const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard/dashboard', label: 'Dashboard', icon: FaChartLine },
    { href: '/dashboard/candidates', label: 'Candidates', icon: FaUsers },
    { href: '/dashboard/reports', label: 'Reports', icon: FaFileAlt },
    { href: '/dashboard/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="py-4 px-3">
        <Link href="/dashboard/dashboard" className="flex items-center px-3 py-2 mb-6">
          <span className="text-xl font-bold text-white">VerifyZen</span>
        </Link>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Core
        </div>

        <nav className="space-y-1">
          {links.slice(0, 2).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={'flex items-center px-3 py-2.5 text-sm font-medium transition-colors rounded ' + (isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white')}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-6">
          Interface
        </div>

        <nav className="space-y-1">
          {links.slice(2).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={'flex items-center px-3 py-2.5 text-sm font-medium transition-colors rounded ' + (isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white')}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
