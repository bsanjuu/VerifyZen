import { apiClient } from './api';
import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../types/candidate';
import { PaginatedResponse } from '../types/api';

export const candidateService = {
  async create(data: CreateCandidateRequest): Promise<Candidate> {
    const { resumeFile, ...candidateData } = data;
    
    if (resumeFile) {
      return apiClient.uploadFile<Candidate>('/candidates', resumeFile, candidateData);
    }
    
    return apiClient.post<Candidate>('/candidates', candidateData);
  },

  async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Candidate>> {
    return apiClient.get<PaginatedResponse<Candidate>>('/candidates?page=' + page + '&limit=' + limit);
  },

  async getById(id: string): Promise<Candidate> {
    return apiClient.get<Candidate>('/candidates/' + id);
  },

  async update(id: string, data: UpdateCandidateRequest): Promise<Candidate> {
    return apiClient.put<Candidate>('/candidates/' + id, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>('/candidates/' + id);
  },

  async uploadResume(candidateId: string, file: File): Promise<{ resumeUrl: string }> {
    return apiClient.uploadFile<{ resumeUrl: string }>('/candidates/' + candidateId + '/resume', file);
  },
};
