'use client';

import { ResumeUpload } from '../candidates/ResumeUpload';

interface DocumentDropZoneProps {
  onFileSelect: (file: File | null) => void;
}

export const DocumentDropZone = ({ onFileSelect }: DocumentDropZoneProps) => {
  return <ResumeUpload onFileSelect={onFileSelect} />;
};
