export type VerificationStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface VerificationResult {
  id: string;
  candidateId: string;
  userId: string;
  status: VerificationStatus;
  riskScore: number;
  findings: Finding[];
  recommendations: string[];
  reportUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Finding {
  type: 'employment' | 'education' | 'timeline' | 'linkedin' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  details?: Record<string, any>;
}

export interface TimelineGap {
  startDate: string;
  endDate: string;
  durationMonths: number;
}

export interface TimelineAnalysis {
  gaps: TimelineGap[];
  overlaps: Array<{
    items: string[];
    startDate: string;
    endDate: string;
  }>;
  totalGapMonths: number;
  hasSignificantGaps: boolean;
}

export interface EmploymentVerificationDetail {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  verified: boolean;
  companyExists: boolean;
  linkedInMatches: boolean;
  discrepancies: string[];
}

export interface EducationVerificationDetail {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  verified: boolean;
  institutionAccredited: boolean;
  isDiplomaMill: boolean;
  discrepancies: string[];
}

export interface VerificationReport {
  id: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
  };
  verificationResult: VerificationResult;
  timelineAnalysis: TimelineAnalysis;
  employmentVerification: EmploymentVerificationDetail[];
  educationVerification: EducationVerificationDetail[];
  linkedInVerification?: {
    profileExists: boolean;
    profileUrl: string;
    matches: boolean;
    discrepancies: string[];
  };
  generatedAt: string;
}

export interface StartVerificationRequest {
  candidateId: string;
  includeLinkedIn?: boolean;
  includeEmployment?: boolean;
  includeEducation?: boolean;
}
