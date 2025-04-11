'use client';

import { useState } from 'react';
import { FilterParams } from '@/app/lib/types';
import { WorkstationCard } from './workstation-card';
import { useWorkstations } from '@/app/lib/hooks/useWorkstations';
import useDashboardStore from '@/app/lib/store/store';
import { Button } from '@/app/components/ui/button';

export function WorkstationsList() {
  const { workstationFilters, selectedWorkstation, setWorkstationFilters } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch workstations with the current filters
  const { data: workstations, error, mutate } = useWorkstations(workstationFilters);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkstationFilters({ search: e.target.value });
  };
  
  // Handle type filter change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWorkstationFilters({ type: e.target.value });
  };
  
  // Handle location filter change
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWorkstationFilters({ location: e.target.value });
  };
  
  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWorkstationFilters({ status: e.target.value });
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true);
    await mutate();
    setIsLoading(false);
  };
  
  // Get unique types, locations, and statuses for filter dropdowns
  const types = workstations ? [...new Set(workstations.map(ws => ws.type))].sort() : [];
  const locations = workstations ? [...new Set(workstations.map(ws => ws.location))].sort() : [];
  const statuses = workstations ? [...new Set(workstations.map(ws => ws.status))].sort() : [];
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Workstations</h2>
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
            <label htmlFor="workstation-search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <input
              id="workstation-search"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Search by name, OS..."
              value={workstationFilters.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium mb-1">
                Type
              </label>
              <select
                id="type-filter"
                className="w-full p-2 border rounded-md"
                value={workstationFilters.type}
                onChange={handleTypeChange}
              >
                <option value="">All types</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type}
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
                value={workstationFilters.location}
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
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status-filter"
                className="w-full p-2 border rounded-md"
                value={workstationFilters.status}
                onChange={handleStatusChange}
              >
                <option value="">All statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="p-4 text-red-500">Error loading workstations: {error.message}</div>
        ) : !workstations ? (
          <div className="flex h-full items-center justify-center">Loading workstations...</div>
        ) : workstations.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            No workstations found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {workstations.map(workstation => (
              <WorkstationCard
                key={workstation.machineName}
                workstation={workstation}
                selected={selectedWorkstation?.machineName === workstation.machineName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}