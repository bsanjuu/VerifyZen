import { useState, useEffect } from 'react';
import { verificationService } from '../services/verification.service';
import { VerificationResult, VerificationReport, StartVerificationRequest } from '../types/verification';

export const useVerification = (verificationId?: string) => {
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVerification = async (request: StartVerificationRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await verificationService.start(request);
      setVerification(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to start verification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchVerification = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await verificationService.getById(id);
      setVerification(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const reportData = await verificationService.getReport(id);
      setReport(reportData);
      return reportData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (id: string) => {
    try {
      const blob = await verificationService.downloadReportPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'verification-report-' + id + '.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to download PDF');
      throw err;
    }
  };

  useEffect(() => {
    if (verificationId) {
      fetchVerification(verificationId);
    }
  }, [verificationId]);

  return {
    verification,
    report,
    loading,
    error,
    startVerification,
    fetchVerification,
    fetchReport,
    downloadPdf,
  };
};
