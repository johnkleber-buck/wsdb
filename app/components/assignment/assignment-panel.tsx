'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import useDashboardStore from '@/app/lib/store/store';
import { useWorkstationAssignment } from '@/app/lib/hooks/useWorkstations';
import { assignWorkstation, checkPolicyCompliance } from '@/app/lib/api/workstationService';
import { formatDate } from '@/app/lib/utils/dateUtils';

export function AssignmentPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<{
    checked: boolean;
    compliant: boolean;
    violations?: string[];
  }>({
    checked: false,
    compliant: false,
  });

  const { selectedUser, selectedWorkstation, setSelectedUser, setSelectedWorkstation } = useDashboardStore();
  const { assign, release } = useWorkstationAssignment();

  const handleCheckCompliance = async () => {
    if (!selectedUser || !selectedWorkstation) return;
    
    setIsLoading(true);
    try {
      const response = await checkPolicyCompliance(selectedWorkstation.machineName, selectedUser.username);
      
      setComplianceStatus({
        checked: true,
        compliant: response.data.compliant,
        violations: response.data.violations,
      });
    } catch (error) {
      console.error('Error checking policy compliance:', error);
      setComplianceStatus({
        checked: true,
        compliant: false,
        violations: ['Error checking policy compliance'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedWorkstation) return;
    
    setIsLoading(true);
    try {
      await assign(selectedWorkstation.machineName, selectedUser.username);
      
      // Reset the form
      setComplianceStatus({
        checked: false,
        compliant: false,
      });
    } catch (error) {
      console.error('Error assigning workstation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelease = async () => {
    if (!selectedWorkstation) return;
    
    setIsLoading(true);
    try {
      await release(selectedWorkstation.machineName);
      
      // Reset the form
      setComplianceStatus({
        checked: false,
        compliant: false,
      });
    } catch (error) {
      console.error('Error releasing workstation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedUser(null);
    setSelectedWorkstation(null);
    setComplianceStatus({
      checked: false,
      compliant: false,
    });
  };
  
  const isAssignmentPossible = 
    selectedUser && 
    selectedWorkstation && 
    selectedWorkstation.status === 'Available';
  
  const isReleaseEnabled = 
    selectedWorkstation && 
    selectedWorkstation.status === 'Assigned';

  return (
    <div className="p-4 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Assignment Controls</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Selected User</h3>
          {selectedUser ? (
            <div className="p-3 bg-gray-100 rounded-md">
              <div className="font-medium">{selectedUser.username}</div>
              <div className="text-sm text-gray-600">{selectedUser.role}</div>
              <div className="text-sm text-gray-600">{selectedUser.department} • {selectedUser.location}</div>
            </div>
          ) : (
            <div className="p-3 bg-gray-100 rounded-md text-gray-500 text-sm">
              No user selected
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Selected Workstation</h3>
          {selectedWorkstation ? (
            <div className="p-3 bg-gray-100 rounded-md">
              <div className="font-medium">{selectedWorkstation.machineName}</div>
              <div className="text-sm text-gray-600">{selectedWorkstation.type} • {selectedWorkstation.location}</div>
              <div className="text-sm text-gray-600">Status: {selectedWorkstation.status}</div>
              {selectedWorkstation.assignedTo && (
                <div className="text-sm text-gray-600">
                  Assigned to: {selectedWorkstation.assignedTo}
                  {selectedWorkstation.assignmentStartTime && (
                    <span> since {formatDate(selectedWorkstation.assignmentStartTime, 'PPP')}</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-100 rounded-md text-gray-500 text-sm">
              No workstation selected
            </div>
          )}
        </div>
      </div>
      
      {complianceStatus.checked && (
        <div className={`mb-4 p-3 rounded-md ${complianceStatus.compliant ? 'bg-green-100' : 'bg-red-100'}`}>
          {complianceStatus.compliant ? (
            <div className="text-green-800">
              User and workstation are policy compliant ✓
            </div>
          ) : (
            <div>
              <div className="text-red-800 font-medium">Policy violations detected:</div>
              <ul className="list-disc pl-5 text-red-800">
                {complianceStatus.violations?.map((violation, index) => (
                  <li key={index}>{violation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={handleCheckCompliance}
          disabled={!isAssignmentPossible || isLoading}
        >
          Check Policy Compliance
        </Button>
        
        <Button
          onClick={handleAssign}
          disabled={!isAssignmentPossible || isLoading || (complianceStatus.checked && !complianceStatus.compliant)}
        >
          Assign Workstation
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleRelease}
          disabled={!isReleaseEnabled || isLoading}
        >
          Release Workstation
        </Button>
        
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
}