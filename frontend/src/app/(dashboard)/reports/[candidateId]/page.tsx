'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useVerification } from '../../../../hooks/useVerification';
import { Loading } from '../../../../components/shared/Loading';
import { RiskScoreCard } from '../../../../components/reports/RiskScoreCard';
import { VerificationStatus } from '../../../../components/reports/VerificationStatus';
import { EmploymentVerification } from '../../../../components/reports/EmploymentVerification';
import { EducationVerification } from '../../../../components/reports/EducationVerification';
import { TimelineChart } from '../../../../components/reports/TimelineChart';
import { RecommendationPanel } from '../../../../components/reports/RecommendationPanel';
import { ProgressTracker } from '../../../../components/upload/ProgressTracker';

export default function ReportPage() {
  const params = useParams();
  const { verification, report, loading, fetchVerification, fetchReport, downloadPdf } = useVerification();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params.candidateId) {
      loadData();
    }
  }, [params.candidateId]);

  const loadData = async () => {
    const verificationId = params.candidateId as string;
    await fetchVerification(verificationId);
    if (verification?.status === 'completed') {
      await fetchReport(verificationId);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await downloadPdf(params.candidateId as string);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading verification report..." />;
  }

  if (!verification) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Verification not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verification Report
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              ID: {verification.id}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <VerificationStatus status={verification.status} />
            {verification.status === 'completed' && (
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className={'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ' + (downloading ? 'opacity-50 cursor-not-allowed' : '')}
              >
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-6">
          <ProgressTracker status={verification.status} />
        </div>
      </div>

      {verification.status === 'completed' && report ? (
        <div className="space-y-6">
          <RiskScoreCard score={verification.riskScore} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimelineChart timeline={report.timelineAnalysis} />
            <RecommendationPanel recommendations={verification.recommendations} />
          </div>

          <EmploymentVerification verifications={report.employmentVerification} />
          
          <EducationVerification verifications={report.educationVerification} />

          {report.linkedInVerification && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                LinkedIn Verification
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={report.linkedInVerification.profileExists ? 'text-green-600' : 'text-red-600'}>
                    {report.linkedInVerification.profileExists ? '✓' : '✗'}
                  </span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Profile exists
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={report.linkedInVerification.matches ? 'text-green-600' : 'text-red-600'}>
                    {report.linkedInVerification.matches ? '✓' : '✗'}
                  </span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Profile matches resume
                  </span>
                </div>
                {report.linkedInVerification.discrepancies.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                      Discrepancies:
                    </p>
                    <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                      {report.linkedInVerification.discrepancies.map((disc, i) => (
                        <li key={i}>{disc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : verification.status === 'processing' ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Verification in progress. This may take a few minutes...
          </p>
        </div>
      ) : verification.status === 'failed' ? (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 text-center">
          <p className="text-red-800 dark:text-red-200 text-lg font-semibold">
            Verification Failed
          </p>
          <p className="text-red-600 dark:text-red-400 mt-2">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Verification pending. Please wait...
          </p>
        </div>
      )}
    </div>
  );
}
