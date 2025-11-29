'use client';

import { useEffect, useState } from 'react';
import { useCandidates } from '../../../hooks/useCandidates';
import { verificationService } from '../../../services/verification.service';
import { VerificationResult } from '../../../types/verification';
import Link from 'next/link';
import { FaUsers, FaCheckCircle, FaClipboardList, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function DashboardPage() {
  const { candidates } = useCandidates();
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);

  useEffect(() => {
    fetchRecentVerifications();
  }, []);

  const fetchRecentVerifications = async () => {
    try {
      const response = await verificationService.getAll(1, 5);
      setVerifications(response.data);
    } catch (err) {
      console.error('Failed to fetch verifications:', err);
    }
  };

  const stats = [
    {
      title: 'Total Candidates',
      value: candidates.length,
      icon: FaUsers,
      color: 'blue',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Verifications',
      value: verifications.length,
      icon: FaClipboardList,
      color: 'green',
      change: '+8%',
      isPositive: true,
    },
    {
      title: 'Completed',
      value: verifications.filter(v => v.status === 'completed').length,
      icon: FaCheckCircle,
      color: 'yellow',
      change: '+5%',
      isPositive: true,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white',
      green: 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white',
      yellow: 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 text-sm">Welcome to VerifyZen Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className={'rounded-lg shadow-md p-6 ' + getColorClasses(stat.color)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {stat.title}
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                </div>
                <div className={'text-4xl opacity-20 ' + getIconColorClasses(stat.color)}>
                  <Icon />
                </div>
              </div>
              <div className="flex items-center text-xs">
                {stat.isPositive ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={stat.isPositive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">since last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Verifications</h2>
        </div>
        {verifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {verifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {verification.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{verification.riskScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ' + (verification.status === 'completed' ? 'bg-green-100 text-green-800' : verification.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')}>
                        {verification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={'/dashboard/reports/' + verification.id}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12">
            <p className="text-center text-gray-500">No verifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
