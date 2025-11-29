import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const dateSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  'Invalid date format'
);

// Candidate validation schemas
export const candidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  phone: z.string().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  current: z.boolean().optional(),
});

// Verification request schema
export const verificationRequestSchema = z.object({
  candidateId: uuidSchema,
  verificationType: z.enum([
    'full',
    'employment',
    'education',
    'linkedin',
    'timeline'
  ]),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
});

// LinkedIn verification schema
export const linkedinVerificationSchema = z.object({
  linkedinUrl: z.string().url('Invalid LinkedIn URL'),
  candidateEmail: emailSchema.optional(),
});

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().min(1, 'Company name is required'),
});

// User login schema
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Validation helper function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Async validation helper
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return schema.parseAsync(data);
}
