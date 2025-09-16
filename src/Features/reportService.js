import axios from 'axios';

const API_URL = '/api/Report';

// Function to get the auth token from wherever it's stored
const getAuthToken = () => {
  // Assumes the token is stored in localStorage with the key 'token' after login.
  return localStorage.getItem('token');
};

// Create an axios instance with auth headers
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Create a new report
 * @param {object} reportData - The data for the report.
 * @param {number} reportData.productId - The ID of the product to report.
 * @param {string} reportData.reason - The reason for the report.
 * @returns {Promise}
 */
const createReport = (reportData) => {
  return axiosInstance.post(API_URL, reportData);
};

/**
 * Get all reports for the current user
 * @returns {Promise}
 */
const getMyReports = () => {
  return axiosInstance.get(`${API_URL}/mine`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
};

/**
 * Revoke (delete) a report
 * @param {number} reportId - The ID of the report to revoke.
 * @returns {Promise}
 */
const revokeReport = (reportId) => {
  return axiosInstance.delete(`${API_URL}/${reportId}`);
};

const reportService = {
  createReport,
  getMyReports,
  revokeReport,
};

export default reportService;