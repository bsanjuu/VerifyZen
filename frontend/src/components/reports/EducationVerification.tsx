'use client';

import { EducationVerificationDetail } from '../../types/verification';
import { formatShortDate } from '../../utils/formatters';

interface EducationVerificationProps {
  verifications: EducationVerificationDetail[];
}

export const EducationVerification = ({ verifications }: EducationVerificationProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Education Verification
      </h3>
      <div className="space-y-4">
        {verifications.map((verification, index) => (
          <div
            key={index}
            className={'border rounded-lg p-4 ' + (verification.verified ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800')}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {verification.degree} in {verification.field}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verification.institution}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {formatShortDate(verification.startDate)} -{' '}
                  {verification.endDate ? formatShortDate(verification.endDate) : 'Present'}
                </p>
              </div>
              <span
                className={'px-3 py-1 rounded-full text-xs font-medium ' + (verification.verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200')}
              >
                {verification.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            
            <div className="mt-3 space-y-1">
              <div className="flex items-center text-sm">
                <span className={verification.institutionAccredited ? 'text-green-600' : 'text-red-600'}>
                  {verification.institutionAccredited ? '✓' : '✗'}
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Institution accredited
                </span>
              </div>
              {verification.isDiplomaMill && (
                <div className="flex items-center text-sm">
                  <span className="text-red-600">⚠</span>
                  <span className="ml-2 text-red-600 font-medium">
                    Potential diploma mill
                  </span>
                </div>
              )}
            </div>

            {verification.discrepancies.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Discrepancies:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                  {verification.discrepancies.map((disc, i) => (
                    <li key={i}>{disc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
