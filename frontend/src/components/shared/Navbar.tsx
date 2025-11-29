'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { formatInitials } from '../../utils/formatters';
import { FaBars, FaSearch, FaBell, FaEnvelope, FaUserCircle } from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-gray-700 mr-4">
              <FaBars className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  <Link
                    href={crumb.href}
                    className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-blue-600 hover:text-blue-800'}
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <button className="relative text-gray-500 hover:text-gray-700 p-2">
              <FaBell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button className="relative text-gray-500 hover:text-gray-700 p-2">
              <FaEnvelope className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500"></span>
            </button>

            <div className="border-l border-gray-300 pl-3 ml-3"></div>

            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden md:block">
                  {user.firstName} {user.lastName}
                </span>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {formatInitials(user.firstName, user.lastName)}
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
