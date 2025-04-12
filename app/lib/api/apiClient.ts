import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '../types';
import { mockApiHandlers } from '../mockApi';

// Check if we're in development environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Define a safe API client factory function
function createApiClient(): AxiosInstance {
  try {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BUCK_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  } catch (error) {
    console.warn('Error creating API client, falling back to mock implementation:', error);
    // Return a minimal axios instance as fallback
    return axios.create();
  }
}

// Create the API client
const apiClient = createApiClient();

// Add request interceptor for auth (wrapped in try/catch for safety)
try {
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
} catch (error) {
  console.warn('Error setting up API interceptors:', error);
}

// Helper to determine if we should use mock API
const shouldUseMockApi = () => {
  return isDevelopment || !process.env.NEXT_PUBLIC_BUCK_API_URL;
};

// Generic fetch function with mock fallback
export async function fetchData<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  // Use mock API in development or if API URL is not configured
  if (shouldUseMockApi()) {
    try {
      // Parse the endpoint to determine which mock handler to use
      const path = endpoint.split('/').filter(Boolean);
      const resource = path[0]; // First part of the path indicates the resource
      
      // Call the appropriate mock handler based on the resource
      switch (resource) {
        case 'workstations':
          if (path.length > 1) {
            // Specific workstation request
            return mockApiHandlers.getWorkstationById(path[1]) as Promise<ApiResponse<T>>;
          }
          return mockApiHandlers.getWorkstations(params) as Promise<ApiResponse<T>>;
        
        case 'users':
          if (path.length > 1) {
            // Specific user request
            return mockApiHandlers.getUserByUsername(path[1]) as Promise<ApiResponse<T>>;
          }
          return mockApiHandlers.getUsers(params) as Promise<ApiResponse<T>>;
          
        case 'hardware':
          if (path.length > 1) {
            return mockApiHandlers.getHardwareSpecById(path[1]) as Promise<ApiResponse<T>>;
          }
          return mockApiHandlers.getHardwareSpecs() as Promise<ApiResponse<T>>;
          
        case 'software':
          if (path.length > 1) {
            return mockApiHandlers.getSoftwareByName(path[1]) as Promise<ApiResponse<T>>;
          }
          return mockApiHandlers.getSoftware() as Promise<ApiResponse<T>>;
          
        case 'policies':
          if (path.length > 1) {
            return mockApiHandlers.getPolicyByName(path[1]) as Promise<ApiResponse<T>>;
          }
          return mockApiHandlers.getPolicies() as Promise<ApiResponse<T>>;
          
        default:
          console.warn(`No mock handler for ${endpoint}, returning empty response`);
          return { data: {} as T };
      }
    } catch (error) {
      console.error(`Error using mock API for ${endpoint}:`, error);
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : 'Mock API error',
      };
    }
  }
  
  // Use real API client if mock API is not used
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

// Generic post function with mock fallback
export async function postData<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<ApiResponse<T>> {
  // Use mock API in development
  if (shouldUseMockApi()) {
    try {
      // Parse the endpoint to determine which mock handler to use
      const path = endpoint.split('/').filter(Boolean);
      const resource = path[0]; 
      const action = path[1];
      
      // Handle specific mock post endpoints
      if (resource === 'workstations') {
        if (action === 'assign' && data.machineName && data.username) {
          return mockApiHandlers.assignWorkstation(data.machineName, data.username) as Promise<ApiResponse<T>>;
        }
        if (action === 'release' && data.machineName) {
          return mockApiHandlers.releaseWorkstation(data.machineName) as Promise<ApiResponse<T>>;
        }
        if (action === 'check-policy' && data.machineName && data.username) {
          return mockApiHandlers.checkPolicyCompliance(data.machineName, data.username) as Promise<ApiResponse<T>>;
        }
      }
      
      if (resource === 'slack') {
        if (action === 'send') {
          return mockApiHandlers.sendSlackNotification(data.channel, data.text, data.blocks) as Promise<ApiResponse<T>>;
        }
        if (action === 'workstation-request') {
          return mockApiHandlers.processWorkstationRequest(data) as Promise<ApiResponse<T>>;
        }
      }
      
      if (resource === 'policies' && action === 'create') {
        return mockApiHandlers.createPolicy(data) as Promise<ApiResponse<T>>;
      }
      
      console.warn(`No mock handler for POST ${endpoint}, returning empty response`);
      return { data: {} as T };
    } catch (error) {
      console.error(`Error using mock API for POST ${endpoint}:`, error);
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : 'Mock API error',
      };
    }
  }
  
  // Use real API client if mock API is not used
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