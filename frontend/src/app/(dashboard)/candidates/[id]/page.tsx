'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { candidateService } from '../../../../services/candidate.service';
import { verificationService } from '../../../../services/verification.service';
import { Candidate } from '../../../../types/candidate';
import { VerificationResult } from '../../../../types/verification';
import { Loading } from '../../../../components/shared/Loading';
import { formatFullName, formatDate } from '../../../../utils/formatters';
import { ProgressTracker } from '../../../../components/upload/ProgressTracker';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidate();
    fetchVerifications();
  }, [params.id]);

  const fetchCandidate = async () => {
    try {
      const data = await candidateService.getById(params.id as string);
      setCandidate(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      const data = await verificationService.getByCandidateId(params.id as string);
      setVerifications(data);
    } catch (err) {
      console.error('Failed to fetch verifications:', err);
    }
  };

  const startVerification = async () => {
    setVerifying(true);
    try {
      const result = await verificationService.start({
        candidateId: params.id as string,
        includeLinkedIn: true,
        includeEmployment: true,
        includeEducation: true,
      });
      router.push('/dashboard/reports/' + result.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <Loading text="Loading candidate..." />;
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Candidate not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatFullName(candidate.firstName, candidate.lastName)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{candidate.email}</p>
          </div>
          <button
            onClick={startVerification}
            disabled={verifying}
            className={'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ' + (verifying ? 'opacity-50 cursor-not-allowed' : '')}
          >
            {verifying ? 'Starting...' : 'Start Verification'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{candidate.email}</p>
              </div>
              {candidate.phone && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{candidate.phone}</p>
                </div>
              )}
              {candidate.linkedInUrl && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                  <a
                    href={candidate.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {candidate.workExperience && candidate.workExperience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {candidate.workExperience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.education && candidate.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Education
              </h2>
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-600 pl-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {verifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Verification History
              </h2>
              <div className="space-y-3">
                {verifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => router.push('/dashboard/reports/' + verification.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(verification.createdAt)}
                        </p>
                      </div>
                      <ProgressTracker status={verification.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
