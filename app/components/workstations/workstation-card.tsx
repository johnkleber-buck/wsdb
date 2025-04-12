import { Workstation } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { StatusBadge } from '@/app/components/ui/status-badge';
import useDashboardStore from '@/app/lib/store/store';
import { formatRelativeTime } from '@/app/lib/utils/dateUtils';
import { cn } from '@/app/lib/utils/cn';
import { 
  Computer, 
  MapPin, 
  Clock, 
  Cpu, 
  MonitorPlay,
  User,
  HardDrive,
  ArrowUpDown 
} from 'lucide-react';

type WorkstationCardProps = {
  workstation: Workstation;
  selected?: boolean;
};

export function WorkstationCard({ workstation, selected = false }: WorkstationCardProps) {
  const { setSelectedWorkstation } = useDashboardStore();
  
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-success/20 text-success border-success/20';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Connected':
        return 'bg-success/20 text-success border-success/20';
      case 'Disconnected':
        return 'bg-muted text-muted-foreground border-muted';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getOSIcon = (os: string) => {
    if (os.toLowerCase().includes('windows')) {
      return <div className="h-4 w-4 bg-blue-500 rounded-sm" />;
    } else if (os.toLowerCase().includes('mac')) {
      return <div className="h-4 w-4 rounded-full border-2 border-zinc-800" />;
    } else if (os.toLowerCase().includes('linux')) {
      return <div className="h-4 w-4 rotate-45 bg-orange-500 rounded-sm" />;
    } else {
      return <HardDrive size={16} />;
    }
  };
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md overflow-hidden',
        selected ? 'ring-2 ring-primary shadow-md' : 'hover:bg-secondary/30'
      )}
      onClick={() => setSelectedWorkstation(selected ? null : workstation)}
    >
      <CardHeader className="pb-2 border-b bg-card">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Computer size={18} className="text-primary" />
            </div>
            <CardTitle className="text-lg font-medium truncate max-w-[150px]">
              {workstation.machineName}
            </CardTitle>
          </div>
          
          <div className={cn(
            "text-xs px-2 py-1 rounded-full font-medium border flex items-center gap-1",
            getStatusColors(workstation.status)
          )}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {workstation.status}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                {getOSIcon(workstation.os)}
                <span>{workstation.os}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 text-xs rounded">
              <ArrowUpDown size={12} className="text-muted-foreground" />
              <span>Tier {workstation.tier}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-muted-foreground" />
            <span>{workstation.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Cpu size={14} className="text-muted-foreground" />
            <span>{workstation.type}</span>
          </div>
          
          {workstation.parsecConnectionStatus && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <MonitorPlay size={14} className="text-muted-foreground" />
                <span>Parsec</span>
              </div>
              <div className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium border",
                getStatusColors(workstation.parsecConnectionStatus)
              )}>
                {workstation.parsecConnectionStatus}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>Last seen: {formatRelativeTime(workstation.lastSeen)}</span>
          </div>
        </div>
      </CardContent>
      
      {workstation.assignedTo && (
        <CardFooter className="border-t py-3 bg-muted/20">
          <div className="w-full flex items-center gap-2 text-sm">
            <User size={14} className="text-muted-foreground" />
            <span className="font-medium">Assigned to:</span>
            <span className="text-primary ml-auto">{workstation.assignedTo}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}