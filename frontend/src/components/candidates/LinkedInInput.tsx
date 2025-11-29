'use client';

import { isValidLinkedInUrl } from '../../utils/validators';

interface LinkedInInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const LinkedInInput = ({ value, onChange, error }: LinkedInInputProps) => {
  const isValid = !value || isValidLinkedInUrl(value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        LinkedIn Profile URL
      </label>
      <div className="relative">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://www.linkedin.com/in/username"
          className={'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ' + (!isValid ? 'border-red-500' : 'border-gray-300 dark:border-gray-600')}
        />
        {value && isValid && (
          <span className="absolute right-3 top-3 text-green-500">✓</span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {value && !isValid && !error && (
        <p className="mt-1 text-sm text-red-600">Please enter a valid LinkedIn URL</p>
      )}
    </div>
  );
};
