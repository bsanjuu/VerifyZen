'use client';

import { useState } from 'react';
import { useCandidates } from '../../../hooks/useCandidates';
import { CandidateCard } from '../../../components/candidates/CandidateCard';
import { CandidateForm } from '../../../components/candidates/CandidateForm';
import { Loading } from '../../../components/shared/Loading';

export default function CandidatesPage() {
  const { candidates, loading, error, createCandidate, deleteCandidate } = useCandidates();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data: any) => {
    await createCandidate(data);
    setShowForm(false);
  };

  if (loading && candidates.length === 0) {
    return <Loading text="Loading candidates..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Candidates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and verify candidate credentials
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Candidate'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Add New Candidate
          </h2>
          <CandidateForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onDelete={deleteCandidate}
          />
        ))}
      </div>

      {candidates.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No candidates yet. Click "Add Candidate" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
