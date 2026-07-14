import { Separator } from '@/components/ui/separator';

interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      {label ? (
        <span className="text-muted-foreground shrink-0 text-[11px] font-medium tracking-[0.2em] uppercase">
          {label}
        </span>
      ) : null}
      {label ? <Separator className="flex-1" /> : null}
    </div>
  );
}
