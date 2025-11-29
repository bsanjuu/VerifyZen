import { apiClient } from './api';
import { 
  VerificationResult, 
  VerificationReport,
  StartVerificationRequest 
} from '../types/verification';

export const verificationService = {
  async start(request: StartVerificationRequest): Promise<VerificationResult> {
    return apiClient.post<VerificationResult>('/verifications', request);
  },

  async getById(id: string): Promise<VerificationResult> {
    return apiClient.get<VerificationResult>('/verifications/' + id);
  },

  async getAll(page = 1, limit = 10): Promise<{ data: VerificationResult[] }> {
    return apiClient.get<{ data: VerificationResult[] }>('/verifications?page=' + page + '&limit=' + limit);
  },

  async getByCandidateId(candidateId: string): Promise<VerificationResult[]> {
    return apiClient.get<VerificationResult[]>('/verifications?candidateId=' + candidateId);
  },

  async getReport(verificationId: string): Promise<VerificationReport> {
    return apiClient.get<VerificationReport>('/reports/' + verificationId);
  },

  async downloadReportPdf(verificationId: string): Promise<Blob> {
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1') + '/reports/' + verificationId + '/pdf',
      {
        headers: {
          Authorization: 'Bearer ' + apiClient.getAccessToken(),
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return response.blob();
  },
};
