import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await this.refreshAccessToken(refreshToken);
              this.setTokens(response.accessToken, response.refreshToken);
              
              // Retry original request
              const originalRequest = error.config;
              if (originalRequest) {
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                return this.client(originalRequest);
              }
            } catch {
              this.clearTokens();
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  // Auth API
  async register(data: { email: string; password: string; name: string; companyCode?: string }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/auth/login', data);
    return response.data;
  }

  async refreshAccessToken(refreshToken: string) {
    const response = await this.client.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Users API
  async getProfile() {
    const response = await this.client.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.put('/users/profile', data);
    return response.data;
  }

  // Diagnosis API
  async getDiagnoses(params?: { category?: string; type?: string; language?: string }) {
    const response = await this.client.get('/diagnosis', { params });
    return response.data;
  }

  async getDiagnosis(id: string, language?: string) {
    const response = await this.client.get(`/diagnosis/${id}`, { params: { language } });
    return response.data;
  }

  async startDiagnosisSession(diagnosisId: string) {
    const response = await this.client.post(`/diagnosis/${diagnosisId}/start`);
    return response.data;
  }

  async submitAnswer(sessionId: string, data: { questionId: string; selectedOptionIds?: string[]; textAnswer?: string; scaleValue?: number }) {
    const response = await this.client.post(`/diagnosis/session/${sessionId}/answer`, data);
    return response.data;
  }

  async completeDiagnosis(sessionId: string) {
    const response = await this.client.post(`/diagnosis/session/${sessionId}/complete`);
    return response.data;
  }

  async getDiagnosisResult(resultId: string, language?: string) {
    const response = await this.client.get(`/diagnosis/result/${resultId}`, { params: { language } });
    return response.data;
  }

  async getUserDiagnosisResults(params?: { page?: number; pageSize?: number }) {
    const response = await this.client.get('/diagnosis/user/results', { params });
    return response.data;
  }

  // Chat API
  async getCounselors() {
    const response = await this.client.get('/chat/counselors');
    return response.data;
  }

  async createChatRoom(counselorId: string) {
    const response = await this.client.post('/chat/rooms', { counselorId });
    return response.data;
  }

  async getChatRooms() {
    const response = await this.client.get('/chat/rooms');
    return response.data;
  }

  async getMessages(roomId: string, params?: { page?: number; pageSize?: number }) {
    const response = await this.client.get(`/chat/rooms/${roomId}/messages`, { params });
    return response.data;
  }

  async sendMessage(roomId: string, data: { content: string; messageType?: string }) {
    const response = await this.client.post(`/chat/rooms/${roomId}/messages`, data);
    return response.data;
  }

  // Payments API
  async getCreditPackages() {
    const response = await this.client.get('/payments/packages');
    return response.data;
  }

  async createPaymentIntent(packageId: string) {
    const response = await this.client.post('/payments/create-payment-intent', { packageId });
    return response.data;
  }

  async getPaymentHistory(params?: { page?: number; pageSize?: number }) {
    const response = await this.client.get('/payments/history', { params });
    return response.data;
  }

  // Credits API
  async getCreditBalance() {
    const response = await this.client.get('/credits/balance');
    return response.data;
  }

  async getCreditHistory(params?: { page?: number; pageSize?: number }) {
    const response = await this.client.get('/credits/history', { params });
    return response.data;
  }

  // Reports API
  async generateReport(diagnosisResultId: string, language?: string) {
    const response = await this.client.post(`/reports/generate/${diagnosisResultId}`, null, { params: { language } });
    return response.data;
  }

  async getReport(reportId: string) {
    const response = await this.client.get(`/reports/${reportId}`);
    return response.data;
  }

  async getUserReports(params?: { page?: number; pageSize?: number }) {
    const response = await this.client.get('/reports', { params });
    return response.data;
  }

  // Affiliates API
  async registerAffiliate(data: { payoutMethod: string; payoutDetails: any }) {
    const response = await this.client.post('/affiliates/register', data);
    return response.data;
  }

  async getAffiliateInfo() {
    const response = await this.client.get('/affiliates/me');
    return response.data;
  }

  async getAffiliateStats() {
    const response = await this.client.get('/affiliates/stats');
    return response.data;
  }

  async requestPayout(data: { amount: number; method: string }) {
    const response = await this.client.post('/affiliates/payout', data);
    return response.data;
  }
}

export const api = new ApiClient();
