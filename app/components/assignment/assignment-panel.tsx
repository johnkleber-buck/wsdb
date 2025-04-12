'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import useDashboardStore from '@/app/lib/store/store';
import { useWorkstationAssignment } from '@/app/lib/hooks/useWorkstations';
import { assignWorkstation, checkPolicyCompliance } from '@/app/lib/api/workstationService';
import { formatDate } from '@/app/lib/utils/dateUtils';
import { cn } from '@/app/lib/utils/cn';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  User, 
  Computer, 
  MapPin, 
  Briefcase,
  HardDrive 
} from 'lucide-react';

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
      
      // Format violation messages to be more user-friendly
      let formattedViolations = response.data.violations || [];
      
      // If there are violations, make them more readable
      if (formattedViolations.length > 0) {
        formattedViolations = formattedViolations.map(violation => {
          // Make first letter uppercase and improve readability
          return violation.charAt(0).toUpperCase() + violation.slice(1)
            .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add spaces between camelCase words
        });
      }
      
      setComplianceStatus({
        checked: true,
        compliant: response.data.compliant,
        violations: formattedViolations,
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Assignment Controls</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={isLoading}
          className="text-muted-foreground"
        >
          Clear Selection
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <div className="mr-2 w-3 h-3 rounded-full bg-primary/40"></div>
            Selected User
          </h3>
          {selectedUser ? (
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase size={14} className="text-muted-foreground" />
                <span>{selectedUser.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <MapPin size={14} className="text-muted-foreground" />
                <span>{selectedUser.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Shield size={14} className="text-muted-foreground" />
                <span>{selectedUser.securityClearance}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-secondary/30 rounded-lg border border-dashed text-muted-foreground flex flex-col items-center justify-center h-[140px]">
              <User size={24} className="mb-2 opacity-40" />
              <span>No user selected</span>
              <span className="text-xs">Select a user from the list</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <div className="mr-2 w-3 h-3 rounded-full bg-primary/40"></div>
            Selected Workstation
          </h3>
          {selectedWorkstation ? (
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Computer size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium">{selectedWorkstation.machineName}</div>
                  <div className="text-sm text-muted-foreground">{selectedWorkstation.type} • {selectedWorkstation.tier}</div>
                </div>
                
                <div className={cn(
                  "ml-auto text-xs px-2 py-1 rounded-full border font-medium flex items-center gap-1",
                  selectedWorkstation.status === 'Available' 
                    ? "bg-success/20 text-success border-success/20" 
                    : selectedWorkstation.status === 'Assigned'
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                )}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {selectedWorkstation.status}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-muted-foreground" />
                <span>{selectedWorkstation.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm mt-1">
                <HardDrive size={14} className="text-muted-foreground" />
                <span>{selectedWorkstation.os}</span>
              </div>
              
              {selectedWorkstation.assignedTo && (
                <div className="flex items-center gap-2 text-sm mt-3 pt-3 border-t">
                  <User size={14} className="text-muted-foreground" />
                  <span className="font-medium">Assigned to:</span> 
                  <span className="text-primary">{selectedWorkstation.assignedTo}</span>
                  {selectedWorkstation.assignmentStartTime && (
                    <span className="text-xs text-muted-foreground ml-1">
                      since {formatDate(selectedWorkstation.assignmentStartTime, 'PPP')}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-secondary/30 rounded-lg border border-dashed text-muted-foreground flex flex-col items-center justify-center h-[140px]">
              <Computer size={24} className="mb-2 opacity-40" />
              <span>No workstation selected</span>
              <span className="text-xs">Select a workstation from the list</span>
            </div>
          )}
        </div>
      </div>
      
      {complianceStatus.checked && (
        <div className={cn(
          "mb-6 p-4 rounded-lg border",
          complianceStatus.compliant 
            ? "bg-success/10 border-success/20" 
            : "bg-destructive/10 border-destructive/20"
        )}>
          {complianceStatus.compliant ? (
            <div className="flex items-center text-success">
              <CheckCircle2 size={18} className="mr-2" />
              <span className="font-medium">User and workstation are policy compliant</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center text-destructive mb-2">
                <XCircle size={18} className="mr-2" />
                <span className="font-medium">Policy violations detected</span>
              </div>
              <ul className="space-y-1 pl-6 text-destructive/90">
                {complianceStatus.violations?.map((violation, index) => (
                  <li key={index} className="text-sm list-disc">{violation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap md:flex-nowrap gap-3">
        <Button
          variant="outline"
          onClick={handleCheckCompliance}
          disabled={!isAssignmentPossible || isLoading}
          className="w-full md:w-auto"
        >
          <Shield size={16} className="mr-2" />
          Check Policy Compliance
        </Button>
        
        <Button
          onClick={handleAssign}
          disabled={!isAssignmentPossible || isLoading || (complianceStatus.checked && !complianceStatus.compliant)}
          className="w-full md:w-auto"
        >
          <CheckCircle2 size={16} className="mr-2" />
          Assign Workstation
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleRelease}
          disabled={!isReleaseEnabled || isLoading}
          className="w-full md:w-auto"
        >
          <XCircle size={16} className="mr-2" />
          Release Workstation
        </Button>
      </div>
    </div>
  );
}