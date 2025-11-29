'use client';

import { useEffect, useState } from 'react';
import { useCandidates } from '../../../hooks/useCandidates';
import { verificationService } from '../../../services/verification.service';
import { VerificationResult } from '../../../types/verification';
import Link from 'next/link';

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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Candidates
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {candidates.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Verifications
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {verifications.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Completed
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {verifications.filter(v => v.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Verifications
        </h2>
        {verifications.length > 0 ? (
          <div className="space-y-3">
            {verifications.map((verification) => (
              <Link
                key={verification.id}
                href={'/dashboard/reports/' + verification.id}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Verification {verification.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Risk Score: {verification.riskScore}
                    </p>
                  </div>
                  <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (verification.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : verification.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200')}>
                    {verification.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No verifications yet
          </p>
        )}
      </div>
    </div>
  );
}
