import { User } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import useDashboardStore from '@/app/lib/store/store';
import { cn } from '@/app/lib/utils/cn';
import { 
  User as UserIcon, 
  MapPin, 
  Briefcase, 
  Shield, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

type UserCardProps = {
  user: User;
  selected?: boolean;
};

export function UserCard({ user, selected = false }: UserCardProps) {
  const { setSelectedUser } = useDashboardStore();

  const getSecurityClearanceBadge = (clearance: string) => {
    switch (clearance) {
      case 'Top Secret':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Secret':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confidential':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md overflow-hidden',
        selected ? 'ring-2 ring-primary shadow-md' : 'hover:bg-secondary/30'
      )}
      onClick={() => setSelectedUser(selected ? null : user)}
    >
      <CardHeader className="pb-2 border-b bg-card">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <UserIcon size={18} className="text-primary" />
            </div>
            <CardTitle className="text-lg font-medium">{user.username}</CardTitle>
          </div>
          
          <div className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            user.status === 'Active' 
              ? "bg-success/20 text-success border border-success/20" 
              : "bg-muted text-muted-foreground border border-muted"
          )}>
            <div className="flex items-center gap-1">
              {user.status === 'Active' ? 
                <CheckCircle2 size={12} /> : 
                <XCircle size={12} />
              }
              {user.status}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase size={16} className="text-muted-foreground" />
            <span className="font-medium">{user.role}</span>
            <span className="text-muted-foreground">• {user.department}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-muted-foreground" />
            <span>{user.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-muted-foreground" />
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full border",
              getSecurityClearanceBadge(user.securityClearance)
            )}>
              {user.securityClearance}
            </span>
          </div>
        </div>
      </CardContent>
      
      {user.projectAssignment && (
        <CardFooter className="border-t py-3 bg-muted/20">
          <div className="text-sm">
            <span className="font-medium">Current Project:</span>{' '}
            <span className="text-muted-foreground">{user.projectAssignment}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}