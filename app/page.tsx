'use client';

import { UsersList } from './components/users/users-list';
import { WorkstationsList } from './components/workstations/workstations-list';
import { AssignmentPanel } from './components/assignment/assignment-panel';
import DashboardLayout from './components/dashboard-layout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-2 h-full">
        <div className="border-r overflow-hidden">
          <UsersList />
        </div>
        <div className="overflow-hidden">
          <WorkstationsList />
        </div>
      </div>
      <AssignmentPanel />
    </DashboardLayout>
  );
}