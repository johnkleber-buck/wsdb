import { Workstation } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { StatusBadge } from '@/app/components/ui/status-badge';
import useDashboardStore from '@/app/lib/store/store';
import { formatRelativeTime } from '@/app/lib/utils/dateUtils';
import { cn } from '@/app/lib/utils/cn';

type WorkstationCardProps = {
  workstation: Workstation;
  selected?: boolean;
};

export function WorkstationCard({ workstation, selected = false }: WorkstationCardProps) {
  const { setSelectedWorkstation } = useDashboardStore();
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:bg-accent',
        selected && 'ring-2 ring-primary'
      )}
      onClick={() => setSelectedWorkstation(workstation)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{workstation.machineName}</CardTitle>
          <StatusBadge status={workstation.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Type:</div>
          <div>{workstation.type}</div>
          
          <div className="text-muted-foreground">Location:</div>
          <div>{workstation.location}</div>
          
          <div className="text-muted-foreground">OS:</div>
          <div>{workstation.os}</div>
          
          <div className="text-muted-foreground">Tier:</div>
          <div>{workstation.tier}</div>
          
          <div className="text-muted-foreground">Last seen:</div>
          <div>{formatRelativeTime(workstation.lastSeen)}</div>
          
          {workstation.assignedTo && (
            <>
              <div className="text-muted-foreground">Assigned to:</div>
              <div>{workstation.assignedTo}</div>
            </>
          )}
          
          {workstation.parsecConnectionStatus && (
            <>
              <div className="text-muted-foreground">Parsec:</div>
              <div className="flex items-center">
                <StatusBadge status={workstation.parsecConnectionStatus} className="mr-2" />
                {workstation.currentParsecUser && (
                  <span className="text-xs text-muted-foreground">
                    {workstation.currentParsecUser}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}