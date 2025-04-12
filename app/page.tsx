'use client';

import { UsersList } from './components/users/users-list';
import { WorkstationsList } from './components/workstations/workstations-list';
import { AssignmentPanel } from './components/assignment/assignment-panel';
import DashboardLayout from './components/dashboard-layout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Assign and manage workstations across global studio locations.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <UsersList />
        </div>
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <WorkstationsList />
        </div>
      </div>
      
      <div className="mt-6 border rounded-lg shadow-sm bg-card">
        <AssignmentPanel />
      </div>
    </DashboardLayout>
  );
}