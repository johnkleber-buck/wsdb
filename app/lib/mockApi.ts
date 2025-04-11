import { mockWorkstations, mockUsers, mockHardwareSpecs, mockSoftware, mockPolicies } from './mockData';
import { Workstation, User, FilterParams } from './types';

// Mock delay to simulate API call latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Filter function for workstations
function filterWorkstations(workstations: Workstation[], filters?: FilterParams): Workstation[] {
  if (!filters) return workstations;
  
  return workstations.filter(ws => {
    // Filter by search term across multiple fields
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !ws.machineName.toLowerCase().includes(searchTerm) &&
        !ws.type.toLowerCase().includes(searchTerm) &&
        !ws.location.toLowerCase().includes(searchTerm) &&
        !ws.os.toLowerCase().includes(searchTerm)
      ) {
        return false;
      }
    }
    
    // Filter by specific fields
    if (filters.location && ws.location !== filters.location) return false;
    if (filters.type && ws.type !== filters.type) return false;
    if (filters.status && ws.status !== filters.status) return false;
    if (filters.os && ws.os !== filters.os) return false;
    if (filters.tier && ws.tier !== filters.tier) return false;
    
    return true;
  });
}

// Filter function for users
function filterUsers(users: User[], filters?: FilterParams): User[] {
  if (!filters) return users;
  
  return users.filter(user => {
    // Filter by search term across multiple fields
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !user.username.toLowerCase().includes(searchTerm) &&
        !user.department.toLowerCase().includes(searchTerm) &&
        !user.location.toLowerCase().includes(searchTerm) &&
        !user.role.toLowerCase().includes(searchTerm)
      ) {
        return false;
      }
    }
    
    // Filter by specific fields
    if (filters.location && user.location !== filters.location) return false;
    if (filters.department && user.department !== filters.department) return false;
    if (filters.status && user.status !== filters.status) return false;
    
    return true;
  });
}

// Mock API handlers
export const mockApiHandlers = {
  // Workstation endpoints
  async getWorkstations(params?: FilterParams) {
    await delay(300);
    return { data: filterWorkstations(mockWorkstations, params) };
  },
  
  async getWorkstationById(machineName: string) {
    await delay(200);
    const workstation = mockWorkstations.find(ws => ws.machineName === machineName);
    
    if (!workstation) {
      return { data: {}, error: 'Workstation not found' };
    }
    
    return { data: workstation };
  },
  
  async updateWorkstationStatus(machineName: string, status: Workstation['status'], assignedTo?: string) {
    await delay(500);
    const workstationIndex = mockWorkstations.findIndex(ws => ws.machineName === machineName);
    
    if (workstationIndex === -1) {
      return { data: {}, error: 'Workstation not found' };
    }
    
    // Create a copy of the workstation and update its status
    const updatedWorkstation = { 
      ...mockWorkstations[workstationIndex],
      status,
      assignedTo: assignedTo || undefined,
      assignmentStartTime: assignedTo ? new Date().toISOString() : undefined,
    };
    
    // Update the workstation in the mock data
    mockWorkstations[workstationIndex] = updatedWorkstation;
    
    return { data: updatedWorkstation };
  },
  
  async assignWorkstation(machineName: string, username: string) {
    await delay(500);
    const workstationIndex = mockWorkstations.findIndex(ws => ws.machineName === machineName);
    const user = mockUsers.find(u => u.username === username);
    
    if (workstationIndex === -1) {
      return { data: {}, error: 'Workstation not found' };
    }
    
    if (!user) {
      return { data: {}, error: 'User not found' };
    }
    
    // Check if the workstation is available
    if (mockWorkstations[workstationIndex].status !== 'Available') {
      return { data: {}, error: 'Workstation is not available' };
    }
    
    // Create a copy of the workstation and update its assignment details
    const updatedWorkstation = { 
      ...mockWorkstations[workstationIndex],
      status: 'Assigned' as const,
      assignedTo: username,
      assignmentStartTime: new Date().toISOString(),
      parsecConnectionStatus: 'Disconnected' as const,
      currentParsecUser: undefined,
    };
    
    // Update the workstation in the mock data
    mockWorkstations[workstationIndex] = updatedWorkstation;
    
    return { data: updatedWorkstation };
  },
  
  async releaseWorkstation(machineName: string) {
    await delay(500);
    const workstationIndex = mockWorkstations.findIndex(ws => ws.machineName === machineName);
    
    if (workstationIndex === -1) {
      return { data: {}, error: 'Workstation not found' };
    }
    
    // Create a copy of the workstation and update its assignment details
    const updatedWorkstation = { 
      ...mockWorkstations[workstationIndex],
      status: 'Available' as const,
      assignedTo: undefined,
      assignmentStartTime: undefined,
      parsecConnectionStatus: 'Disconnected' as const,
      currentParsecUser: undefined,
    };
    
    // Update the workstation in the mock data
    mockWorkstations[workstationIndex] = updatedWorkstation;
    
    return { data: updatedWorkstation };
  },
  
  async checkPolicyCompliance(machineName: string, username: string) {
    await delay(300);
    const workstation = mockWorkstations.find(ws => ws.machineName === machineName);
    const user = mockUsers.find(u => u.username === username);
    
    if (!workstation) {
      return { data: {}, error: 'Workstation not found' };
    }
    
    if (!user) {
      return { data: {}, error: 'User not found' };
    }
    
    // Simple policy check based on location for demonstration
    if (workstation.location !== user.location) {
      return { 
        data: { 
          compliant: false, 
          violations: ['Location policy: User and workstation locations must match'] 
        } 
      };
    }
    
    // Check security clearance policies
    if (workstation.policyAssignments.includes('NyClearancePolicy')) {
      if (workstation.location === 'New York' && user.securityClearance !== 'Secret') {
        return { 
          data: { 
            compliant: false, 
            violations: ['Security clearance policy: New York workstations require Secret clearance'] 
          } 
        };
      }
    }
    
    return { data: { compliant: true } };
  },
  
  // User endpoints
  async getUsers(params?: FilterParams) {
    await delay(300);
    return { data: filterUsers(mockUsers, params) };
  },
  
  async getUserByUsername(username: string) {
    await delay(200);
    const user = mockUsers.find(u => u.username === username);
    
    if (!user) {
      return { data: {}, error: 'User not found' };
    }
    
    return { data: user };
  },
  
  async updateUserProjectAssignment(username: string, projectAssignment: string) {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      return { data: {}, error: 'User not found' };
    }
    
    // Create a copy of the user and update the project assignment
    const updatedUser = { 
      ...mockUsers[userIndex],
      projectAssignment,
    };
    
    // Update the user in the mock data
    mockUsers[userIndex] = updatedUser;
    
    return { data: updatedUser };
  },
  
  async getUserAssignments(username: string) {
    await delay(300);
    const user = mockUsers.find(u => u.username === username);
    
    if (!user) {
      return { data: {}, error: 'User not found' };
    }
    
    // Find current assignment
    const currentAssignment = mockWorkstations.find(ws => ws.assignedTo === username);
    
    // For demo purposes, create some mock assignment history
    const history = [
      {
        machineName: 'NYC-WS-001',
        startTime: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), // 7 days ago
        endTime: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 days ago
      },
      {
        machineName: 'NYC-WS-002',
        startTime: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
        endTime: undefined, // Currently assigned
      },
    ];
    
    return { 
      data: {
        currentAssignment: currentAssignment?.machineName,
        history,
      }
    };
  },
  
  // Hardware endpoints
  async getHardwareSpecs() {
    await delay(300);
    return { data: mockHardwareSpecs };
  },
  
  async getHardwareSpecById(specId: string) {
    await delay(200);
    const spec = mockHardwareSpecs.find(s => s.specId === specId);
    
    if (!spec) {
      return { data: {}, error: 'Hardware spec not found' };
    }
    
    return { data: spec };
  },
  
  // Software endpoints
  async getSoftware() {
    await delay(300);
    return { data: mockSoftware };
  },
  
  async getSoftwareByName(softwareName: string) {
    await delay(200);
    const software = mockSoftware.find(s => s.softwareName === softwareName);
    
    if (!software) {
      return { data: {}, error: 'Software not found' };
    }
    
    return { data: software };
  },
  
  // Policy endpoints
  async getPolicies() {
    await delay(300);
    return { data: mockPolicies };
  },
  
  async getPolicyByName(policyName: string) {
    await delay(200);
    const policy = mockPolicies.find(p => p.policyName === policyName);
    
    if (!policy) {
      return { data: {}, error: 'Policy not found' };
    }
    
    return { data: policy };
  },
  
  async createPolicy(policy: any) {
    await delay(500);
    const newPolicy = {
      ...policy,
      policyName: policy.policyName || `policy-${Date.now()}`,
    };
    
    // Add the new policy to the mock data
    mockPolicies.push(newPolicy);
    
    return { data: newPolicy };
  },
  
  // Slack endpoints
  async sendSlackNotification(channel: string, message: string, blocks?: any[]) {
    await delay(300);
    console.log(`Mock Slack notification to ${channel}: ${message}`);
    return { data: { ok: true } };
  },
  
  async processWorkstationRequest(payload: any) {
    await delay(500);
    console.log('Mock workstation request:', payload);
    
    // For demonstration, return a successful response with a random workstation
    const availableWorkstations = mockWorkstations.filter(ws => ws.status === 'Available');
    
    if (availableWorkstations.length === 0) {
      return { 
        data: {
          success: false,
          message: 'No workstations available matching your requirements',
        } 
      };
    }
    
    const randomIndex = Math.floor(Math.random() * availableWorkstations.length);
    const assignedWorkstation = availableWorkstations[randomIndex];
    
    return {
      data: {
        success: true,
        message: `Workstation ${assignedWorkstation.machineName} has been assigned to you`,
        workstation: {
          machineName: assignedWorkstation.machineName,
          location: assignedWorkstation.location,
        },
      }
    };
  },
};