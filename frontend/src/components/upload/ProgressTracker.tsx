'use client';

import { VerificationStatus } from '../../types/verification';

interface ProgressTrackerProps {
  status: VerificationStatus;
}

export const ProgressTracker = ({ status }: ProgressTrackerProps) => {
  const steps = [
    { id: 'pending', label: 'Initiated' },
    { id: 'processing', label: 'Processing' },
    { id: 'completed', label: 'Completed' },
  ];

  const getCurrentStep = () => {
    if (status === 'failed') return -1;
    return steps.findIndex(step => step.id === status);
  };

  const currentStep = getCurrentStep();

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={'w-10 h-10 rounded-full flex items-center justify-center font-semibold ' + (index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500')}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={'mt-2 text-xs font-medium ' + (index <= currentStep ? 'text-blue-600' : 'text-gray-500')}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={'flex-1 h-1 mx-2 ' + (index < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')}
              />
            )}
          </div>
        ))}
      </div>
      {status === 'failed' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <span className="text-red-600 dark:text-red-400 font-medium">
            Verification failed. Please try again.
          </span>
        </div>
      )}
    </div>
  );
};
