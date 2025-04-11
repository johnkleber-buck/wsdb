import { create } from 'zustand';
import { User, Workstation, Policy } from '../types';

interface DashboardStore {
  // Selection state
  selectedUser: User | null;
  selectedWorkstation: Workstation | null;
  
  // UI state
  userPanelOpen: boolean;
  workstationPanelOpen: boolean;
  
  // Filter state
  userFilters: {
    search: string;
    department: string;
    location: string;
    status: string;
  };
  workstationFilters: {
    search: string;
    type: string;
    location: string;
    status: string;
    os: string;
  };
  
  // Actions
  setSelectedUser: (user: User | null) => void;
  setSelectedWorkstation: (workstation: Workstation | null) => void;
  setUserPanelOpen: (open: boolean) => void;
  setWorkstationPanelOpen: (open: boolean) => void;
  setUserFilters: (filters: Partial<DashboardStore['userFilters']>) => void;
  setWorkstationFilters: (filters: Partial<DashboardStore['workstationFilters']>) => void;
  resetFilters: () => void;
  
  // Assignment state
  assignmentInProgress: boolean;
  assignmentError: string | null;
  setAssignmentInProgress: (inProgress: boolean) => void;
  setAssignmentError: (error: string | null) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  // Initial state
  selectedUser: null,
  selectedWorkstation: null,
  userPanelOpen: false,
  workstationPanelOpen: false,
  userFilters: {
    search: '',
    department: '',
    location: '',
    status: '',
  },
  workstationFilters: {
    search: '',
    type: '',
    location: '',
    status: '',
    os: '',
  },
  assignmentInProgress: false,
  assignmentError: null,
  
  // Actions
  setSelectedUser: (user) => set({ selectedUser: user, userPanelOpen: !!user }),
  setSelectedWorkstation: (workstation) => set({ selectedWorkstation: workstation, workstationPanelOpen: !!workstation }),
  setUserPanelOpen: (open) => set({ userPanelOpen: open }),
  setWorkstationPanelOpen: (open) => set({ workstationPanelOpen: open }),
  setUserFilters: (filters) => set((state) => ({ 
    userFilters: { ...state.userFilters, ...filters } 
  })),
  setWorkstationFilters: (filters) => set((state) => ({ 
    workstationFilters: { ...state.workstationFilters, ...filters } 
  })),
  resetFilters: () => set({ 
    userFilters: {
      search: '',
      department: '',
      location: '',
      status: '',
    },
    workstationFilters: {
      search: '',
      type: '',
      location: '',
      status: '',
      os: '',
    }
  }),
  setAssignmentInProgress: (inProgress) => set({ assignmentInProgress: inProgress }),
  setAssignmentError: (error) => set({ assignmentError: error }),
}));

export default useDashboardStore;