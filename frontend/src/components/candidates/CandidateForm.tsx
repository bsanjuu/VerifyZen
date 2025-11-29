'use client';

import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { CreateCandidateRequest } from '../../types/candidate';
import { ResumeUpload } from './ResumeUpload';
import { LinkedInInput } from './LinkedInInput';
import { isValidEmail, isValidPhone } from '../../utils/validators';

interface CandidateFormProps {
  onSubmit: (data: CreateCandidateRequest) => Promise<void>;
  onCancel?: () => void;
}

export const CandidateForm = ({ onSubmit, onCancel }: CandidateFormProps) => {
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const { values, errors, handleChange, setFieldValue, setFieldError } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedInUrl: '',
  });

  const validate = (): boolean => {
    let isValid = true;

    if (!values.firstName.trim()) {
      setFieldError('firstName', 'First name is required');
      isValid = false;
    }

    if (!values.lastName.trim()) {
      setFieldError('lastName', 'Last name is required');
      isValid = false;
    }

    if (!values.email.trim()) {
      setFieldError('email', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(values.email)) {
      setFieldError('email', 'Invalid email address');
      isValid = false;
    }

    if (values.phone && !isValidPhone(values.phone)) {
      setFieldError('phone', 'Invalid phone number');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const data: CreateCandidateRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        linkedInUrl: values.linkedInUrl || undefined,
        resumeFile: resumeFile || undefined,
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Failed to create candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            className={'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ' + (errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600')}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            className={'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ' + (errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600')}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ' + (errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            className={'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ' + (errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <LinkedInInput
        value={values.linkedInUrl}
        onChange={(value) => setFieldValue('linkedInUrl', value)}
        error={errors.linkedInUrl}
      />

      <ResumeUpload onFileSelect={setResumeFile} />

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ' + (loading ? 'opacity-50 cursor-not-allowed' : '')}
        >
          {loading ? 'Creating...' : 'Create Candidate'}
        </button>
      </div>
    </form>
  );
};
