import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type AuthFormErrorProps = {
  message?: string;
};

export function AuthFormError({ message }: AuthFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-2 rounded-2xl border px-3 py-2.5 text-sm"
    >
      <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
