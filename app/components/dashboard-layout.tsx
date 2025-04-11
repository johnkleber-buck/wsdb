'use client';

import { ReactNode } from 'react';
import SWRProvider from '../lib/providers/SWRProvider';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SWRProvider>
      <div className="flex flex-col h-screen">
        <header className="bg-primary text-primary-foreground px-6 py-4 shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Workstation Dashboard</h1>
            <div className="text-sm">Global Creative Studio</div>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        
        <footer className="bg-gray-100 px-6 py-2 text-center text-sm text-gray-500">
          <div>Workstation Assignment & Management Dashboard</div>
        </footer>
      </div>
    </SWRProvider>
  );
}