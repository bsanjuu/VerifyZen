'use client';

import { VerificationStatus as Status } from '../../types/verification';

interface VerificationStatusProps {
  status: Status;
}

export const VerificationStatus = ({ status }: VerificationStatusProps) => {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: '✓',
        };
      case 'processing':
        return {
          label: 'Processing',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: '⏳',
        };
      case 'failed':
        return {
          label: 'Failed',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: '✗',
        };
      default:
        return {
          label: 'Pending',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: '○',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ' + config.color}>
      <span className="mr-2">{config.icon}</span>
      {config.label}
    </span>
  );
};
