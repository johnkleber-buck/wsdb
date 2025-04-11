import { formatDistanceToNow, parseISO, format } from 'date-fns';

/**
 * Format a date string as a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Never';
  
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString?: string, formatStr: string = 'PPp'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}