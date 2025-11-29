import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { User, LoginRequest, RegisterRequest } from '../types/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      router.push('/dashboard/candidates');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      router.push('/dashboard/candidates');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
