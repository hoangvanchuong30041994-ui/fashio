import type { OrderStatus } from '@generated/prisma/enums';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  CONFIRMED: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  PROCESSING: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  SHIPPED: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  DELIVERED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  CANCELLED: 'bg-destructive/10 text-destructive',
  REFUNDED: 'bg-stone-500/10 text-stone-700 dark:text-stone-300',
};

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return <Badge className={cn('hover:bg-current/10', STATUS_CLASS[status])}>{label}</Badge>;
}
