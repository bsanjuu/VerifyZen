import OpenAI from 'openai';
import env from './env';

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const OPENAI_CONFIG = {
  model: env.OPENAI_MODEL,
  temperature: 0.3, // Lower temperature for more consistent results
  maxTokens: 2000,

  // Prompts for different verification tasks
  prompts: {
    resumeParsing: `You are an expert at extracting structured information from resumes.
Extract the following information in JSON format:
- Personal information (name, email, phone)
- Work experience (company, title, dates, responsibilities)
- Education (institution, degree, dates, field of study)
- Skills and certifications
- Any other relevant professional information

Be precise with dates and ensure all information is accurately extracted.`,

    timelineAnalysis: `You are an expert at analyzing professional timelines for inconsistencies.
Review the provided work history and education timeline. Identify:
1. Timeline gaps (periods with no activity)
2. Overlapping positions that seem suspicious
3. Unusual progression patterns
4. Any other red flags

Provide a detailed analysis in JSON format with severity levels (low, medium, high) for each finding.`,

    companyVerification: `You are an expert at verifying company information.
Given a company name and dates of employment, determine:
1. If the company existed during the specified period
2. If the company is known to be legitimate
3. Any red flags or concerns

Provide your assessment in JSON format.`,

    educationVerification: `You are an expert at verifying educational credentials.
Given an educational institution and degree information, assess:
1. If the institution is accredited
2. If the degree program exists
3. Any red flags or concerns

Provide your assessment in JSON format.`,
  },
};

export default openai;
