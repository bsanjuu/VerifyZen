import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { ExternalServiceError } from '../utils/errorHandler';

export interface EducationInstitution {
  name: string;
  accredited: boolean;
  country: string;
  type: 'university' | 'college' | 'institution' | 'unknown';
  website?: string;
  verified: boolean;
}

export class EducationVerifierClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://universities.hipolabs.com',
      timeout: 10000,
    });
  }

  async verifyInstitution(institutionName: string, country?: string): Promise<{
    exists: boolean;
    accredited: boolean;
    info?: EducationInstitution;
    confidence: number;
  }> {
    try {
      logger.info(`Verifying educational institution: ${institutionName}`);

      // Use Hipolabs Universities API
      const params: any = {
        name: institutionName,
      };

      if (country) {
        params.country = country;
      }

      const response = await this.client.get('/search', { params });

      if (response.data && response.data.length > 0) {
        const institution = response.data[0];

        const info: EducationInstitution = {
          name: institution.name,
          accredited: true, // Assume institutions in the database are accredited
          country: institution.country,
          type: this.determineInstitutionType(institution.name),
          website: institution.web_pages?.[0],
          verified: true,
        };

        logger.info(`Institution verified: ${institutionName}`);

        return {
          exists: true,
          accredited: true,
          info,
          confidence: 95,
        };
      }

      // Try fuzzy matching
      const fuzzyMatch = await this.fuzzyMatchInstitution(institutionName, country);
      if (fuzzyMatch) {
        return fuzzyMatch;
      }

      logger.info(`Institution not found: ${institutionName}`);

      return {
        exists: false,
        accredited: false,
        confidence: 0,
      };
    } catch (error) {
      logger.error('Failed to verify educational institution:', error);
      throw new ExternalServiceError(
        'Failed to verify educational institution',
        'Education Verifier'
      );
    }
  }

  async verifyDegree(
    institutionName: string,
    degreeName: string,
    fieldOfStudy?: string
  ): Promise<{
    institutionExists: boolean;
    degreeValid: boolean;
    redFlags: string[];
    confidence: number;
  }> {
    try {
      logger.info(`Verifying degree: ${degreeName} from ${institutionName}`);

      const institutionCheck = await this.verifyInstitution(institutionName);

      const redFlags: string[] = [];
      let confidence = 100;

      // Check if institution exists
      if (!institutionCheck.exists) {
        redFlags.push('Institution not found in accredited universities database');
        confidence = 0;
      }

      // Check for diploma mill indicators
      const diplomaMills = [
        'university of life',
        'universal life church',
        'trinity southern',
        'american university london',
      ];

      if (diplomaMills.some(mill => institutionName.toLowerCase().includes(mill))) {
        redFlags.push('Institution flagged as potential diploma mill');
        confidence = Math.max(confidence - 80, 0);
      }

      // Check for suspicious degree names
      const suspiciousDegrees = ['honorary', 'life experience', 'accelerated online'];
      if (suspiciousDegrees.some(deg => degreeName.toLowerCase().includes(deg))) {
        redFlags.push('Degree name contains suspicious keywords');
        confidence = Math.max(confidence - 40, 0);
      }

      logger.info(`Degree verification completed: ${degreeName}`);

      return {
        institutionExists: institutionCheck.exists,
        degreeValid: redFlags.length === 0,
        redFlags,
        confidence,
      };
    } catch (error) {
      logger.error('Failed to verify degree:', error);
      throw new ExternalServiceError(
        'Failed to verify degree',
        'Education Verifier'
      );
    }
  }

  private async fuzzyMatchInstitution(
    institutionName: string,
    country?: string
  ): Promise<{
    exists: boolean;
    accredited: boolean;
    info?: EducationInstitution;
    confidence: number;
  } | null> {
    try {
      // Get all institutions for the country
      const params: any = {};
      if (country) {
        params.country = country;
      }

      const response = await this.client.get('/search', { params });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Simple fuzzy matching based on name similarity
      const normalizedSearchName = institutionName.toLowerCase().replace(/[^\w\s]/g, '');

      for (const institution of response.data) {
        const normalizedInstName = institution.name.toLowerCase().replace(/[^\w\s]/g, '');

        if (normalizedInstName.includes(normalizedSearchName) ||
            normalizedSearchName.includes(normalizedInstName)) {
          const info: EducationInstitution = {
            name: institution.name,
            accredited: true,
            country: institution.country,
            type: this.determineInstitutionType(institution.name),
            website: institution.web_pages?.[0],
            verified: true,
          };

          return {
            exists: true,
            accredited: true,
            info,
            confidence: 75, // Lower confidence for fuzzy match
          };
        }
      }

      return null;
    } catch (error) {
      logger.error('Fuzzy matching failed:', error);
      return null;
    }
  }

  private determineInstitutionType(name: string): 'university' | 'college' | 'institution' | 'unknown' {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('university')) {
      return 'university';
    } else if (lowerName.includes('college')) {
      return 'college';
    } else if (lowerName.includes('institute') || lowerName.includes('school')) {
      return 'institution';
    }

    return 'unknown';
  }
}

export const educationVerifierClient = new EducationVerifierClient();
