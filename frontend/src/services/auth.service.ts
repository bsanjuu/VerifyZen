import { apiClient } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (response.tokens) {
      apiClient.setAccessToken(response.tokens.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    if (response.tokens) {
      apiClient.setAccessToken(response.tokens.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  },

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<LoginResponse>('/auth/refresh', { refreshToken });
    if (response.tokens) {
      apiClient.setAccessToken(response.tokens.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  },

  logout() {
    apiClient.setAccessToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken();
  },
};
