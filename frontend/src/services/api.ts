import { ApiError, ApiResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers['Authorization'] = 'Bearer ' + this.accessToken;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(this.baseUrl + endpoint, config);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'An error occurred',
          statusCode: response.status,
          errors: data.errors,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }
      throw {
        message: 'Network error',
        statusCode: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, JSON.stringify(additionalData[key]));
      });
    }

    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers['Authorization'] = 'Bearer ' + this.accessToken;
    }

    try {
      const response = await fetch(this.baseUrl + endpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'An error occurred',
          statusCode: response.status,
          errors: data.errors,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }
      throw {
        message: 'Network error',
        statusCode: 0,
      } as ApiError;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
