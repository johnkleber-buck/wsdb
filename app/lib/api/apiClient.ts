import axios from 'axios';
import { ApiResponse } from '../types';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BUCK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = process.env.NEXT_PUBLIC_BUCK_API_KEY;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic fetch function
export async function fetchData<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<T>(endpoint, { params });
    return { data: response.data };
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Generic post function
export async function postData<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(endpoint, data);
    return { data: response.data };
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export default apiClient;