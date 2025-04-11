import useSWR from 'swr';
import { FilterParams, Workstation } from '../types';
import { getWorkstations, getWorkstationById, assignWorkstation, releaseWorkstation } from '../api/workstationService';

// Fetcher function for SWR
const fetcher = async (url: string, params?: FilterParams) => {
  const response = await getWorkstations(params);
  if (response.error) throw new Error(response.error);
  return response.data;
};

// Hook for fetching all workstations with filtering
export function useWorkstations(filters?: FilterParams) {
  // Create a unique key for SWR based on the filters
  const filterKey = filters ? new URLSearchParams(filters as Record<string, string>).toString() : '';
  const key = `/workstations${filterKey ? '?' + filterKey : ''}`;
  
  return useSWR<Workstation[]>(
    key,
    () => fetcher(key, filters),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );
}

// Hook for fetching a single workstation
export function useWorkstation(machineName: string | null) {
  return useSWR<Workstation>(
    machineName ? `/workstations/${machineName}` : null,
    async () => {
      if (!machineName) return null;
      const response = await getWorkstationById(machineName);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    {
      refreshInterval: 15000, // Refresh more frequently for single workstation view
      revalidateOnFocus: true,
    }
  );
}

// Hook for workstation assignment
export function useWorkstationAssignment() {
  const { mutate } = useSWR('/workstations');
  
  const assign = async (machineName: string, username: string) => {
    const response = await assignWorkstation(machineName, username);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Revalidate both the workstations list and the specific workstation
    mutate();
    mutate(`/workstations/${machineName}`);
    
    return response.data;
  };
  
  const release = async (machineName: string) => {
    const response = await releaseWorkstation(machineName);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Revalidate both the workstations list and the specific workstation
    mutate();
    mutate(`/workstations/${machineName}`);
    
    return response.data;
  };
  
  return { assign, release };
}