import { cn } from '@/app/lib/utils/cn';

type StatusBadgeProps = {
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Connected' | 'Disconnected' | 'Unknown' | string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Unknown':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        getStatusColor(),
        className
      )}
    >
      {status}
    </span>
  );
}