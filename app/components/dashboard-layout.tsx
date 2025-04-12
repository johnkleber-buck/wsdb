'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import SWRProvider from '../lib/providers/SWRProvider';
import { 
  LayoutGrid, 
  Users, 
  BarChart3, 
  Settings, 
  Computer, 
  Menu, 
  X,
  CheckSquare,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils/cn';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/' },
    { name: 'Workstations', icon: Computer, href: '/workstations' },
    { name: 'Users', icon: Users, href: '/users' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
    { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { name: 'Help', icon: HelpCircle, href: '/help' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <SWRProvider>
      <div className="flex h-screen bg-[#f8fafc]">
        {/* Sidebar for desktop */}
        <div 
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col bg-card shadow-lg transition-all duration-300 ease-in-out",
            isSidebarOpen ? "w-64" : "w-20"
          )}
        >
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className={cn("flex items-center", !isSidebarOpen && "justify-center w-full")}>
              <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">WS</span>
              </div>
              {isSidebarOpen && (
                <span className="ml-3 text-lg font-semibold">Workstation DB</span>
              )}
            </div>
            <button 
              onClick={toggleSidebar} 
              className={cn("text-muted-foreground hover:text-foreground", !isSidebarOpen && "hidden")}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2 pt-5">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  "hover:bg-accent hover:text-accent-foreground",
                  item.href === '/reports' ? "bg-accent text-accent-foreground" : "text-foreground",
                  !isSidebarOpen && "justify-center"
                )}
              >
                <item.icon size={20} className={isSidebarOpen ? "mr-3" : ""} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t">
            <div className={cn("flex items-center", !isSidebarOpen && "justify-center")}>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                JD
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={toggleMobileMenu}
          ></div>
        )}

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center">
              <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">WS</span>
              </div>
              <span className="ml-3 text-lg font-semibold">Workstation DB</span>
            </div>
            <button onClick={toggleMobileMenu} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 p-2 pt-5">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  "hover:bg-accent hover:text-accent-foreground",
                  item.href === '/reports' ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
                onClick={toggleMobileMenu}
              >
                <item.icon size={20} className="mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}>
          {/* Header */}
          <header className="z-10 h-16 border-b bg-card/80 backdrop-blur-sm px-4 sm:px-6 sticky top-0">
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMobileMenu}
                  className="text-muted-foreground hover:text-foreground lg:hidden"
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold">Workstation Dashboard</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-sm text-muted-foreground">Global Creative Studio</span>
                <button className="text-muted-foreground hover:text-destructive">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="mx-auto p-4 sm:p-6 animate-in">
              {children}
            </div>
          </main>
          
          <footer className="border-t py-3 px-6 text-center text-sm text-muted-foreground">
            <div>Workstation Assignment & Management Dashboard • {new Date().getFullYear()}</div>
          </footer>
        </div>
      </div>
    </SWRProvider>
  );
}