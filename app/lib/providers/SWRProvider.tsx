import { SWRConfig } from 'swr';
import { mockApiHandlers } from '../mockApi';

// Determine if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development';

type SWRProviderProps = {
  children: React.ReactNode;
};

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // In development, use the mock API handlers
        fetcher: async (resource: string, init?: RequestInit) => {
          if (isDevelopment) {
            // Parse the resource to determine the endpoint and parameters
            const url = new URL(resource, 'http://localhost');
            const path = url.pathname;
            const params = Object.fromEntries(url.searchParams);
            
            // Extract the endpoint from the path
            if (path.startsWith('/workstations')) {
              const machineName = path.split('/')[2];
              
              if (path.includes('/check-policy-compliance')) {
                return mockApiHandlers.checkPolicyCompliance(machineName, params.username as string);
              } else if (path.includes('/assign')) {
                return mockApiHandlers.assignWorkstation(machineName, params.username as string);
              } else if (path.includes('/release')) {
                return mockApiHandlers.releaseWorkstation(machineName);
              } else if (path.includes('/status')) {
                return mockApiHandlers.updateWorkstationStatus(
                  machineName, 
                  params.status as any,
                  params.assignedTo as string
                );
              } else if (machineName) {
                return mockApiHandlers.getWorkstationById(machineName);
              } else {
                return mockApiHandlers.getWorkstations(params);
              }
            } else if (path.startsWith('/users')) {
              const username = path.split('/')[2];
              
              if (path.includes('/project')) {
                return mockApiHandlers.updateUserProjectAssignment(
                  username, 
                  params.projectAssignment as string
                );
              } else if (path.includes('/assignments')) {
                return mockApiHandlers.getUserAssignments(username);
              } else if (username) {
                return mockApiHandlers.getUserByUsername(username);
              } else {
                return mockApiHandlers.getUsers(params);
              }
            } else if (path.startsWith('/hardware-specs')) {
              const specId = path.split('/')[2];
              
              if (specId) {
                return mockApiHandlers.getHardwareSpecById(specId);
              } else {
                return mockApiHandlers.getHardwareSpecs();
              }
            } else if (path.startsWith('/software')) {
              const softwareName = path.split('/')[2];
              
              if (softwareName) {
                return mockApiHandlers.getSoftwareByName(softwareName);
              } else {
                return mockApiHandlers.getSoftware();
              }
            } else if (path.startsWith('/policies')) {
              const policyName = path.split('/')[2];
              
              if (policyName) {
                return mockApiHandlers.getPolicyByName(policyName);
              } else {
                return mockApiHandlers.getPolicies();
              }
            } else if (path.startsWith('/slack')) {
              if (path.includes('/send')) {
                return mockApiHandlers.sendSlackNotification(
                  params.channel as string,
                  params.text as string,
                  params.blocks as any
                );
              } else if (path.includes('/workstation-request')) {
                return mockApiHandlers.processWorkstationRequest(params);
              }
            }
            
            // If no mock handler is found, return an error
            console.error(`No mock handler found for ${path}`);
            return { data: {}, error: 'Endpoint not implemented in mock API' };
          }
          
          // In production, use the real API
          const res = await fetch(resource, init);
          if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.');
            throw error;
          }
          
          return res.json();
        },
        onError: (error, key) => {
          // Log errors during development
          if (isDevelopment) {
            console.error(`SWR Error for ${key}:`, error);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}