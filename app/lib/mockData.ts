import { Workstation, User, HardwareSpecs, Software, Policy } from './types';

// Mock Hardware Specs
export const mockHardwareSpecs: HardwareSpecs[] = [
  {
    specId: 'tier1',
    cpuModel: 'Intel Xeon Gold 6330',
    cpuCores: 28,
    cpuSpeed: 3.1,
    gpu: 'NVIDIA RTX A6000',
    ram: 128,
    nicSpeed: '10 GbE',
  },
  {
    specId: 'tier2',
    cpuModel: 'Intel Xeon W-3375',
    cpuCores: 24,
    cpuSpeed: 2.5,
    gpu: 'NVIDIA RTX A5000',
    ram: 64,
    nicSpeed: '10 GbE',
  },
  {
    specId: 'tier3',
    cpuModel: 'AMD Ryzen 9 5950X',
    cpuCores: 16,
    cpuSpeed: 3.4,
    gpu: 'NVIDIA RTX 3080',
    ram: 32,
    nicSpeed: '1 GbE',
  },
];

// Mock Software
export const mockSoftware: Software[] = [
  { softwareName: 'Maya', version: '2024' },
  { softwareName: 'Houdini', version: '20.0' },
  { softwareName: 'Nuke', version: '14.0' },
  { softwareName: 'Cinema 4D', version: 'R26' },
  { softwareName: 'Adobe Creative Suite', version: '2023' },
  { softwareName: 'Unreal Engine', version: '5.3' },
  { softwareName: 'Blender', version: '3.6' },
];

// Mock Policies
export const mockPolicies: Policy[] = [
  {
    policyName: 'NyClearancePolicy',
    criteria: { location: 'New York', securityClearance: 'Secret' },
    allowedDisallowed: 'Allowed',
  },
  {
    policyName: 'LondonRestrictedPolicy',
    criteria: { location: 'London', securityClearance: 'Restricted' },
    allowedDisallowed: 'Disallowed',
  },
  {
    policyName: 'AnimationDeptHighTierOnly',
    criteria: { department: 'Animation', tier: 'tier1' },
    allowedDisallowed: 'Allowed',
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    username: 'jsmith',
    department: 'Animation',
    location: 'New York',
    status: 'Active',
    securityClearance: 'Secret',
    projectAssignment: 'Project Alpha',
    role: 'Senior Animator',
  },
  {
    username: 'agarcia',
    department: 'VFX',
    location: 'London',
    status: 'Active',
    securityClearance: 'Confidential',
    projectAssignment: 'Project Beta',
    role: 'VFX Artist',
  },
  {
    username: 'mwilliams',
    department: 'Lighting',
    location: 'Los Angeles',
    status: 'Active',
    securityClearance: 'Public',
    projectAssignment: 'Project Gamma',
    role: 'Lighting Artist',
  },
  {
    username: 'dkim',
    department: 'Compositing',
    location: 'Vancouver',
    status: 'Active',
    securityClearance: 'Confidential',
    projectAssignment: 'Project Alpha',
    role: 'Compositor',
  },
  {
    username: 'jlee',
    department: 'Rigging',
    location: 'Sydney',
    status: 'Active',
    securityClearance: 'Public',
    projectAssignment: 'Project Delta',
    role: 'Technical Rigger',
  },
];

// Mock Workstations
export const mockWorkstations: Workstation[] = [
  {
    machineName: 'NYC-WS-001',
    type: 'Desktop',
    location: 'New York',
    os: 'Windows 11 Pro',
    tier: 'tier1',
    hardwareSpecsId: 'tier1',
    softwareIds: ['Maya', 'Houdini', 'Nuke'],
    status: 'Available',
    lastSeen: new Date().toISOString(),
    parsecConnectionStatus: 'Disconnected',
    ou: 'OU=Animation,OU=Workstations,DC=studio,DC=local',
    policyAssignments: ['NyClearancePolicy'],
  },
  {
    machineName: 'NYC-WS-002',
    type: 'Desktop',
    location: 'New York',
    os: 'Windows 11 Pro',
    tier: 'tier1',
    hardwareSpecsId: 'tier1',
    softwareIds: ['Maya', 'Cinema 4D', 'Adobe Creative Suite'],
    status: 'Assigned',
    assignedTo: 'jsmith',
    assignmentStartTime: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    lastSeen: new Date().toISOString(),
    parsecConnectionStatus: 'Connected',
    currentParsecUser: 'jsmith',
    ou: 'OU=Animation,OU=Workstations,DC=studio,DC=local',
    policyAssignments: ['NyClearancePolicy'],
  },
  {
    machineName: 'LON-WS-001',
    type: 'Desktop',
    location: 'London',
    os: 'Linux CentOS 8',
    tier: 'tier2',
    hardwareSpecsId: 'tier2',
    softwareIds: ['Nuke', 'Adobe Creative Suite'],
    status: 'Available',
    lastSeen: new Date().toISOString(),
    parsecConnectionStatus: 'Disconnected',
    ou: 'OU=VFX,OU=Workstations,DC=studio,DC=local',
    policyAssignments: ['LondonRestrictedPolicy'],
  },
  {
    machineName: 'LAX-WS-001',
    type: 'VM',
    location: 'Los Angeles',
    os: 'Windows 11 Pro',
    tier: 'tier3',
    hardwareSpecsId: 'tier3',
    softwareIds: ['Blender', 'Adobe Creative Suite'],
    status: 'Maintenance',
    lastSeen: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    parsecConnectionStatus: 'Unknown',
    ou: 'OU=Lighting,OU=Workstations,DC=studio,DC=local',
    policyAssignments: [],
  },
  {
    machineName: 'VAN-WS-001',
    type: 'Desktop',
    location: 'Vancouver',
    os: 'Windows 11 Pro',
    tier: 'tier2',
    hardwareSpecsId: 'tier2',
    softwareIds: ['Nuke', 'Adobe Creative Suite'],
    status: 'Available',
    lastSeen: new Date().toISOString(),
    parsecConnectionStatus: 'Disconnected',
    ou: 'OU=Compositing,OU=Workstations,DC=studio,DC=local',
    policyAssignments: [],
  },
];