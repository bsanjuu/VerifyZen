'use client';

import Link from 'next/link';
import { Candidate } from '../../types/candidate';
import { formatDate, formatFullName, formatInitials } from '../../utils/formatters';

interface CandidateCardProps {
  candidate: Candidate;
  onDelete?: (id: string) => void;
}

export const CandidateCard = ({ candidate, onDelete }: CandidateCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {formatInitials(candidate.firstName, candidate.lastName)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatFullName(candidate.firstName, candidate.lastName)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={'/dashboard/candidates/' + candidate.id}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(candidate.id)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {candidate.phone && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Phone:</span> {candidate.phone}
          </p>
        )}
        {candidate.linkedInUrl && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">LinkedIn:</span>{' '}
            <a
              href={candidate.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Profile
            </a>
          </p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Added {formatDate(candidate.createdAt)}
          </p>
          {candidate.workExperience && candidate.workExperience.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {candidate.workExperience.length} work experience(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
