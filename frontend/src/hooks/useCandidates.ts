import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidate.service';
import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../types/candidate';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCandidates = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidateService.getAll(page, limit);
      setCandidates(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const createCandidate = async (data: CreateCandidateRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newCandidate = await candidateService.create(data);
      setCandidates((prev) => [newCandidate, ...prev]);
      return newCandidate;
    } catch (err: any) {
      setError(err.message || 'Failed to create candidate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id: string, data: UpdateCandidateRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await candidateService.update(id, data);
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update candidate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await candidateService.delete(id);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete candidate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading,
    error,
    pagination,
    fetchCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  };
};
