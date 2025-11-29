'use client';

import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { formatInitials } from '../../utils/formatters';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard/candidates" className="text-2xl font-bold text-blue-600">
              VerifyZen
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.firstName} {user.lastName}
              </span>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {formatInitials(user.firstName, user.lastName)}
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
