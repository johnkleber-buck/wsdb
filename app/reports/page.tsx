'use client';

import { useState } from 'react';
import { useWorkstations } from '@/app/lib/hooks/useWorkstations';
import { useUsers } from '@/app/lib/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Button } from '@/app/components/ui/button';
import DashboardLayout from '@/app/components/dashboard-layout';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

// Chart components
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Utilization chart component
const UtilizationChart = ({ data, total }: { data: Record<string, number>, total: number }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / total) * 100).toFixed(1)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} workstations`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Location chart component
const LocationChart = ({ 
  data 
}: { 
  data: Record<string, { total: number; available: number; assigned: number; maintenance: number }> 
}) => {
  const chartData = Object.entries(data).map(([location, stats]) => ({
    location,
    Available: stats.available,
    Assigned: stats.assigned,
    Maintenance: stats.maintenance
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="location" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Available" stackId="a" fill="#00C49F" />
        <Bar dataKey="Assigned" stackId="a" fill="#0088FE" />
        <Bar dataKey="Maintenance" stackId="a" fill="#FFBB28" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Assignment chart by department
const AssignmentChart = ({ 
  workstations, 
  users 
}: { 
  workstations: any[]; 
  users: any[] 
}) => {
  // Group assignments by department
  const departmentCounts: Record<string, number> = {};
  
  workstations.forEach(ws => {
    if (ws.assignedTo) {
      const user = users.find(u => u.username === ws.assignedTo);
      if (user) {
        const dept = user.department;
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
      }
    }
  });
  
  const chartData = Object.entries(departmentCounts)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Workstations" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'utilization' | 'location' | 'assignment'>('utilization');
  const { data: workstations, error: workstationsError } = useWorkstations();
  const { data: users, error: usersError } = useUsers();
  
  const downloadCSV = () => {
    if (!workstations) return;
    
    let csvContent = "";
    
    // Create headers based on report type
    if (reportType === 'utilization') {
      csvContent = "Status,Count,Percentage\n";
      const statusCounts = getStatusCounts();
      for (const [status, count] of Object.entries(statusCounts)) {
        const percentage = ((count / workstations.length) * 100).toFixed(2);
        csvContent += `"${status}",${count},${percentage}%\n`;
      }
    } else if (reportType === 'location') {
      csvContent = "Location,Total,Available,Assigned,Maintenance\n";
      const locationData = getLocationData();
      for (const location of Object.keys(locationData)) {
        csvContent += `"${location}",${locationData[location].total},${locationData[location].available},${locationData[location].assigned},${locationData[location].maintenance}\n`;
      }
    } else if (reportType === 'assignment') {
      csvContent = "Machine Name,Type,Location,Assigned To,Department,Assignment Date\n";
      const assignedWorkstations = workstations.filter(ws => ws.status === 'Assigned');
      for (const ws of assignedWorkstations) {
        const user = users?.find(u => u.username === ws.assignedTo);
        csvContent += `"${ws.machineName}","${ws.type}","${ws.location}","${ws.assignedTo || ''}","${user?.department || ''}","${ws.assignmentStartTime || ''}"\n`;
      }
    }
    
    // Create a downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportType}-report.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };
  
  // Get counts for each status
  const getStatusCounts = () => {
    if (!workstations) return {};
    
    return workstations.reduce((acc, ws) => {
      acc[ws.status] = (acc[ws.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };
  
  // Get data grouped by location
  const getLocationData = () => {
    if (!workstations) return {};
    
    return workstations.reduce((acc, ws) => {
      if (!acc[ws.location]) {
        acc[ws.location] = {
          total: 0,
          available: 0,
          assigned: 0,
          maintenance: 0,
        };
      }
      
      acc[ws.location].total += 1;
      
      if (ws.status === 'Available') {
        acc[ws.location].available += 1;
      } else if (ws.status === 'Assigned') {
        acc[ws.location].assigned += 1;
      } else if (ws.status === 'Maintenance') {
        acc[ws.location].maintenance += 1;
      }
      
      return acc;
    }, {} as Record<string, { total: number; available: number; assigned: number; maintenance: number }>);
  };
  
  // Render utilization report
  const renderUtilizationReport = () => {
    if (!workstations) return <div>Loading data...</div>;
    
    const statusCounts = getStatusCounts();
    const statuses = Object.keys(statusCounts);
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Workstation Utilization</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statuses.map(status => {
            const count = statusCounts[status];
            const percentage = ((count / workstations.length) * 100).toFixed(2);
            
            return (
              <Card key={status}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <StatusBadge status={status} className="mr-2" />
                    {status}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{percentage}% of total</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="h-64 border rounded-lg p-4 mb-6">
          {workstations && (
            <UtilizationChart data={getStatusCounts()} total={workstations.length} />
          )}
        </div>
      </div>
    );
  };
  
  // Render location report
  const renderLocationReport = () => {
    if (!workstations) return <div>Loading data...</div>;
    
    const locationData = getLocationData();
    const locations = Object.keys(locationData).sort();
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Workstations by Location</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-right">Available</th>
                <th className="p-2 text-right">Assigned</th>
                <th className="p-2 text-right">Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => (
                <tr key={location} className="border-b">
                  <td className="p-2">{location}</td>
                  <td className="p-2 text-right">{locationData[location].total}</td>
                  <td className="p-2 text-right">{locationData[location].available}</td>
                  <td className="p-2 text-right">{locationData[location].assigned}</td>
                  <td className="p-2 text-right">{locationData[location].maintenance}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-muted/50">
                <td className="p-2">Total</td>
                <td className="p-2 text-right">
                  {locations.reduce((sum, loc) => sum + locationData[loc].total, 0)}
                </td>
                <td className="p-2 text-right">
                  {locations.reduce((sum, loc) => sum + locationData[loc].available, 0)}
                </td>
                <td className="p-2 text-right">
                  {locations.reduce((sum, loc) => sum + locationData[loc].assigned, 0)}
                </td>
                <td className="p-2 text-right">
                  {locations.reduce((sum, loc) => sum + locationData[loc].maintenance, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="h-64 border rounded-lg p-4 my-6">
          {workstations && (
            <LocationChart data={locationData} />
          )}
        </div>
      </div>
    );
  };
  
  // Render assignment report
  const renderAssignmentReport = () => {
    if (!workstations || !users) return <div>Loading data...</div>;
    
    const assignedWorkstations = workstations.filter(ws => ws.status === 'Assigned');
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
        
        {assignedWorkstations.length === 0 ? (
          <div className="p-4 border rounded-lg">
            No workstations are currently assigned.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">Machine Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Assigned To</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Assignment Date</th>
                </tr>
              </thead>
              <tbody>
                {assignedWorkstations.map(ws => {
                  const user = users.find(u => u.username === ws.assignedTo);
                  
                  return (
                    <tr key={ws.machineName} className="border-b">
                      <td className="p-2">{ws.machineName}</td>
                      <td className="p-2">{ws.type}</td>
                      <td className="p-2">{ws.location}</td>
                      <td className="p-2">{ws.assignedTo}</td>
                      <td className="p-2">{user?.department || '-'}</td>
                      <td className="p-2">
                        {ws.assignmentStartTime
                          ? new Date(ws.assignmentStartTime).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="h-64 border rounded-lg p-4 my-6">
          {workstations && assignedWorkstations.length > 0 && (
            <AssignmentChart workstations={assignedWorkstations} users={users || []} />
          )}
        </div>
      </div>
    );
  };
  
  // Render the selected report
  const renderReport = () => {
    if (workstationsError || usersError) {
      return (
        <div className="p-4 text-red-500">
          Error loading data: {workstationsError?.message || usersError?.message}
        </div>
      );
    }
    
    switch (reportType) {
      case 'utilization':
        return renderUtilizationReport();
      case 'location':
        return renderLocationReport();
      case 'assignment':
        return renderAssignmentReport();
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          
          <div className="flex space-x-2">
            <Button
              variant={reportType === 'utilization' ? 'default' : 'outline'}
              onClick={() => setReportType('utilization')}
            >
              Utilization
            </Button>
            
            <Button
              variant={reportType === 'location' ? 'default' : 'outline'}
              onClick={() => setReportType('location')}
            >
              Location
            </Button>
            
            <Button
              variant={reportType === 'assignment' ? 'default' : 'outline'}
              onClick={() => setReportType('assignment')}
            >
              Assignments
            </Button>
            
            <Button variant="outline" onClick={downloadCSV}>
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          {renderReport()}
        </div>
      </div>
    </DashboardLayout>
  );
}