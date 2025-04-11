'use client';

import { useState } from 'react';
import { User, FilterParams } from '@/app/lib/types';
import { UserCard } from './user-card';
import { useUsers } from '@/app/lib/hooks/useUsers';
import useDashboardStore from '@/app/lib/store/store';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils/cn';

export function UsersList() {
  const { userFilters, selectedUser, setUserFilters } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch users with the current filters
  const { data: users, error, mutate } = useUsers(userFilters);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilters({ search: e.target.value });
  };
  
  // Handle department filter change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilters({ department: e.target.value });
  };
  
  // Handle location filter change
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilters({ location: e.target.value });
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true);
    await mutate();
    setIsLoading(false);
  };
  
  // Get unique departments and locations for filter dropdowns
  const departments = users ? [...new Set(users.map(user => user.department))].sort() : [];
  const locations = users ? [...new Set(users.map(user => user.location))].sort() : [];
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="user-search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <input
              id="user-search"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Search by name, role..."
              value={userFilters.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="department-filter" className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                id="department-filter"
                className="w-full p-2 border rounded-md"
                value={userFilters.department}
                onChange={handleDepartmentChange}
              >
                <option value="">All departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location-filter" className="block text-sm font-medium mb-1">
                Location
              </label>
              <select
                id="location-filter"
                className="w-full p-2 border rounded-md"
                value={userFilters.location}
                onChange={handleLocationChange}
              >
                <option value="">All locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="p-4 text-red-500">Error loading users: {error.message}</div>
        ) : !users ? (
          <div className="flex h-full items-center justify-center">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            No users found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.map(user => (
              <UserCard
                key={user.username}
                user={user}
                selected={selectedUser?.username === user.username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}