import { apiClient } from './api';

export const linkedInService = {
  async getAuthUrl(): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>('/linkedin/auth');
  },

  async verifyProfile(candidateId: string, linkedInUrl: string): Promise<any> {
    return apiClient.post<any>('/linkedin/verify', {
      candidateId,
      linkedInUrl,
    });
  },
};
