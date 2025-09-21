import axios from 'axios';

const BASE_URL = 'https://localhost:7235/api/Wallet';

// Create axios instance with default config
const walletApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  },
  // Handle HTTPS self-signed certificates in development
  httpsAgent: process.env.NODE_ENV === 'development' ? {
    rejectUnauthorized: false
  } : undefined
});

// Add request interceptor to include auth token if available
walletApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
walletApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Wallet API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const walletService = {
  // Deposit money to wallet
  async deposit(amount) {
    try {
      const response = await walletApi.post('/deposits', { amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Deposit failed');
    }
  },

  // Get wallet balance
  async getBalance() {
    try {
      const response = await walletApi.get('/balance');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get balance');
    }
  },

  // Handle PayOS webhook (GET)
  async getPayOSWebhook() {
    try {
      const response = await walletApi.get('/webhook/payos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Webhook GET failed');
    }
  },

  // Handle PayOS webhook (POST)
  async postPayOSWebhook(webhookData) {
    try {
      const response = await walletApi.post('/webhook/payos', webhookData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Webhook POST failed');
    }
  }
};

export default walletService;
