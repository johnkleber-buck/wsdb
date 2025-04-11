import useSWR from 'swr';
import { FilterParams, User } from '../types';
import { getUsers, getUserByUsername, updateUserProjectAssignment } from '../api/userService';

// Fetcher function for SWR
const fetcher = async (url: string, params?: FilterParams) => {
  const response = await getUsers(params);
  if (response.error) throw new Error(response.error);
  return response.data;
};

// Hook for fetching all users with filtering
export function useUsers(filters?: FilterParams) {
  // Create a unique key for SWR based on the filters
  const filterKey = filters ? new URLSearchParams(filters as Record<string, string>).toString() : '';
  const key = `/users${filterKey ? '?' + filterKey : ''}`;
  
  return useSWR<User[]>(
    key,
    () => fetcher(key, filters),
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );
}

// Hook for fetching a single user
export function useUser(username: string | null) {
  return useSWR<User>(
    username ? `/users/${username}` : null,
    async () => {
      if (!username) return null;
      const response = await getUserByUsername(username);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );
}

// Hook for updating user project assignment
export function useUserProjectAssignment() {
  const { mutate } = useSWR('/users');
  
  const updateProject = async (username: string, projectAssignment: string) => {
    const response = await updateUserProjectAssignment(username, projectAssignment);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Revalidate both the users list and the specific user
    mutate();
    mutate(`/users/${username}`);
    
    return response.data;
  };
  
  return { updateProject };
}