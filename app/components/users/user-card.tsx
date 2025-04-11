import { User } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import useDashboardStore from '@/app/lib/store/store';
import { cn } from '@/app/lib/utils/cn';

type UserCardProps = {
  user: User;
  selected?: boolean;
};

export function UserCard({ user, selected = false }: UserCardProps) {
  const { setSelectedUser } = useDashboardStore();
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:bg-accent',
        selected && 'ring-2 ring-primary'
      )}
      onClick={() => setSelectedUser(user)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{user.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Role:</div>
          <div>{user.role}</div>
          
          <div className="text-muted-foreground">Department:</div>
          <div>{user.department}</div>
          
          <div className="text-muted-foreground">Location:</div>
          <div>{user.location}</div>
          
          <div className="text-muted-foreground">Project:</div>
          <div>{user.projectAssignment || 'Unassigned'}</div>
          
          <div className="text-muted-foreground">Clearance:</div>
          <div>{user.securityClearance}</div>
        </div>
      </CardContent>
    </Card>
  );
}