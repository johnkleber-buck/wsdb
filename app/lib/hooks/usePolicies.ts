import useSWR from 'swr';
import { Policy } from '../types';
import { getPolicies, getPolicyByName, createPolicy } from '../api/policyService';

// Hook for fetching all policies
export function usePolicies() {
  return useSWR<Policy[]>(
    '/policies',
    async () => {
      const response = await getPolicies();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );
}

// Hook for fetching a single policy
export function usePolicy(policyName: string | null) {
  return useSWR<Policy>(
    policyName ? `/policies/${policyName}` : null,
    async () => {
      if (!policyName) return null;
      const response = await getPolicyByName(policyName);
      if (response.error) throw new Error(response.error);
      return response.data;
    }
  );
}

// Hook for creating policies
export function usePolicyCreation() {
  const { mutate } = useSWR('/policies');
  
  const create = async (policy: Omit<Policy, 'policyName'> & { policyName?: string }) => {
    const response = await createPolicy(policy);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Revalidate the policies list
    mutate();
    
    return response.data;
  };
  
  return { create };
}