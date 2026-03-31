// services/authService.ts
import api from './api';
import { type LoginCredentials, type SignupData, type AuthResponse, type User } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error.response?.data);
      throw error;
    }
  }

  async signup(data: SignupData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      console.log('Signup request data:', data); // Debug log
      const response = await api.post('/auth/signup', data);
      console.log('Signup response:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Signup API error:', error.response?.data);
      console.error('Signup API error status:', error.response?.status);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async getProfile(): Promise<{ success: boolean; user: User }> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }

  async checkDoctorAuthorization(): Promise<any> {
    const response = await api.get('/auth/check-doctor');
    return response.data;
  }

  async checkMLTAuthorization(): Promise<any> {
    const response = await api.get('/auth/check-mlt');
    return response.data;
  }

  async mltLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  async debugToken(): Promise<any> {
    const response = await api.get('/auth/debug-token');
    return response.data;
  }
}

export default new AuthService();