import axios, { AxiosInstance } from 'axios';
import linkedinConfig from '../config/linkedin.config';
import { logger } from '../utils/logger';
import { ExternalServiceError } from '../utils/errorHandler';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  positions?: Array<{
    title: string;
    companyName: string;
    startDate: {
      month?: number;
      year: number;
    };
    endDate?: {
      month?: number;
      year: number;
    };
    current: boolean;
  }>;
  education?: Array<{
    schoolName: string;
    degreeName?: string;
    fieldOfStudy?: string;
    startDate?: {
      year: number;
    };
    endDate?: {
      year: number;
    };
  }>;
}

export class LinkedInClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.linkedin.com/v2',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    try {
      logger.info('Fetching LinkedIn profile');

      const response = await this.client.get('/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      logger.info('LinkedIn profile fetched successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch LinkedIn profile:', error);
      throw new ExternalServiceError(
        'Failed to fetch LinkedIn profile',
        'LinkedIn API'
      );
    }
  }

  async getPositions(accessToken: string): Promise<any[]> {
    try {
      logger.info('Fetching LinkedIn positions');

      const response = await this.client.get('/positions', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      logger.info('LinkedIn positions fetched successfully');
      return response.data.elements || [];
    } catch (error) {
      logger.error('Failed to fetch LinkedIn positions:', error);
      throw new ExternalServiceError(
        'Failed to fetch LinkedIn positions',
        'LinkedIn API'
      );
    }
  }

  async verifyProfile(linkedinUrl: string): Promise<{
    exists: boolean;
    profileData?: LinkedInProfile;
    error?: string;
  }> {
    try {
      logger.info(`Verifying LinkedIn profile: ${linkedinUrl}`);

      // Note: In a production environment, you would use LinkedIn's API
      // or a web scraping service to verify the profile exists.
      // For this implementation, we'll return a placeholder response.

      // Extract username from URL
      const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^/]+)/);
      if (!usernameMatch) {
        return {
          exists: false,
          error: 'Invalid LinkedIn URL format',
        };
      }

      // In production, make actual API call or scraping request here
      logger.info('LinkedIn profile verification completed');

      return {
        exists: true,
        profileData: undefined, // Would contain actual profile data
      };
    } catch (error) {
      logger.error('Failed to verify LinkedIn profile:', error);
      throw new ExternalServiceError(
        'Failed to verify LinkedIn profile',
        'LinkedIn'
      );
    }
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
    try {
      logger.info('Exchanging authorization code for access token');

      const response = await axios.post(
        linkedinConfig.endpoints.token,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: linkedinConfig.clientId!,
          client_secret: linkedinConfig.clientSecret!,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      logger.info('Access token obtained successfully');
      return response.data.access_token;
    } catch (error) {
      logger.error('Failed to exchange code for token:', error);
      throw new ExternalServiceError(
        'Failed to obtain LinkedIn access token',
        'LinkedIn OAuth'
      );
    }
  }

  getAuthorizationUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: linkedinConfig.clientId!,
      redirect_uri: redirectUri,
      state,
      scope: linkedinConfig.scopes.join(' '),
    });

    return `${linkedinConfig.endpoints.auth}?${params.toString()}`;
  }
}

export const linkedinClient = new LinkedInClient();
