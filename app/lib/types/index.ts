// Core data model types

export type Workstation = {
  machineName: string;
  type: 'Desktop' | 'Laptop' | 'VM';
  location: string;
  os: string;
  tier: string;
  hardwareSpecsId: string;
  softwareIds: string[];
  status: 'Available' | 'Assigned' | 'Maintenance';
  assignedTo?: string;
  assignmentStartTime?: string;
  lastSeen?: string;
  parsecConnectionStatus?: 'Connected' | 'Disconnected' | 'Unknown';
  currentParsecUser?: string;
  ou: string;
  policyAssignments: string[];
};

export type User = {
  username: string;
  department: string;
  location: string;
  status: 'Active' | 'Inactive';
  securityClearance: string;
  projectAssignment?: string;
  role: string;
};

export type HardwareSpecs = {
  specId: string;
  cpuModel: string;
  cpuCores: number;
  cpuSpeed: number;
  gpu: string;
  ram: number;
  nicSpeed: string;
};

export type Software = {
  softwareName: string;
  version: string;
};

export type Policy = {
  policyName: string;
  criteria: Record<string, any>;
  allowedDisallowed: 'Allowed' | 'Disallowed';
};

// API response types
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type FilterParams = {
  search?: string;
  location?: string;
  status?: string;
  department?: string;
  type?: string;
  os?: string;
  tier?: string;
};