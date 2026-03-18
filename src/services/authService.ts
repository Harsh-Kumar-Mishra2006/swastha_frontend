// services/authService.ts (add this method)
import api from './api';
import { type LoginCredentials, type SignupData, type AuthResponse, type User } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async signup(data: SignupData): Promise<{ success: boolean; message: string; user?: User }> {
    const response = await api.post('/auth/signup', data);
    return response.data;
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

  // New method to handle doctor login with password from Doctor model
  async doctorLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  async debugToken(): Promise<any> {
    const response = await api.get('/auth/debug-token');
    return response.data;
  }
}

export default new AuthService();