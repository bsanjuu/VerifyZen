import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { ExternalServiceError } from '../utils/errorHandler';
import env from '../config/env';

export interface CompanyInfo {
  name: string;
  domain?: string;
  foundedYear?: number;
  status: 'active' | 'inactive' | 'acquired' | 'closed' | 'unknown';
  industry?: string;
  size?: string;
  website?: string;
  verified: boolean;
}

export class CompanyRegistryClient {
  private clearbitClient: AxiosInstance;
  private crunchbaseClient: AxiosInstance;

  constructor() {
    this.clearbitClient = axios.create({
      baseURL: 'https://company.clearbit.com/v2',
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${env.CLEARBIT_API_KEY}`,
      },
    });

    this.crunchbaseClient = axios.create({
      baseURL: 'https://api.crunchbase.com/api/v4',
      timeout: 10000,
      headers: {
        'X-cb-user-key': env.CRUNCHBASE_API_KEY,
      },
    });
  }

  async getCompanyInfo(companyName: string, domain?: string): Promise<CompanyInfo | null> {
    try {
      logger.info(`Fetching company info for: ${companyName}`);

      // Try Clearbit first
      if (env.CLEARBIT_API_KEY && domain) {
        try {
          const response = await this.clearbitClient.get(`/companies/find`, {
            params: { domain },
          });

          if (response.data) {
            return this.parseClearbitResponse(response.data);
          }
        } catch (error) {
          logger.warn('Clearbit lookup failed, trying alternative sources');
        }
      }

      // Try Crunchbase as fallback
      if (env.CRUNCHBASE_API_KEY) {
        try {
          const response = await this.crunchbaseClient.get(`/entities/organizations`, {
            params: { name: companyName },
          });

          if (response.data?.entities?.length > 0) {
            return this.parseCrunchbaseResponse(response.data.entities[0]);
          }
        } catch (error) {
          logger.warn('Crunchbase lookup failed');
        }
      }

      logger.info(`Company info not found for: ${companyName}`);
      return null;
    } catch (error) {
      logger.error('Failed to fetch company info:', error);
      throw new ExternalServiceError(
        'Failed to fetch company information',
        'Company Registry'
      );
    }
  }

  async verifyCompanyExists(
    companyName: string,
    employmentDates: { start: Date; end?: Date }
  ): Promise<{
    exists: boolean;
    existedDuringPeriod: boolean;
    confidence: number;
    info?: CompanyInfo;
  }> {
    try {
      logger.info(`Verifying company existence: ${companyName}`);

      const info = await this.getCompanyInfo(companyName);

      if (!info) {
        return {
          exists: false,
          existedDuringPeriod: false,
          confidence: 0,
        };
      }

      // Check if company existed during employment period
      let existedDuringPeriod = true;
      let confidence = 100;

      if (info.foundedYear) {
        const employmentStartYear = employmentDates.start.getFullYear();
        if (info.foundedYear > employmentStartYear) {
          existedDuringPeriod = false;
          confidence = 0;
        }
      }

      // Reduce confidence if company is closed or inactive
      if (info.status === 'closed' || info.status === 'inactive') {
        confidence = Math.max(confidence - 30, 0);
      }

      logger.info(`Company verification completed: ${companyName}`);

      return {
        exists: true,
        existedDuringPeriod,
        confidence,
        info,
      };
    } catch (error) {
      logger.error('Failed to verify company existence:', error);
      throw new ExternalServiceError(
        'Failed to verify company',
        'Company Registry'
      );
    }
  }

  private parseClearbitResponse(data: any): CompanyInfo {
    return {
      name: data.name,
      domain: data.domain,
      foundedYear: data.foundedYear,
      status: 'active', // Clearbit typically only has active companies
      industry: data.category?.industry,
      size: data.metrics?.employees ? `${data.metrics.employees}` : undefined,
      website: data.url,
      verified: true,
    };
  }

  private parseCrunchbaseResponse(data: any): CompanyInfo {
    return {
      name: data.properties?.name,
      domain: data.properties?.website_url?.replace(/^https?:\/\//, ''),
      foundedYear: data.properties?.founded_on?.year,
      status: data.properties?.status || 'unknown',
      industry: data.properties?.categories?.join(', '),
      size: data.properties?.num_employees_enum,
      website: data.properties?.website_url,
      verified: true,
    };
  }
}

export const companyRegistryClient = new CompanyRegistryClient();
