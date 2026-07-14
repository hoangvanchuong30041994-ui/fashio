import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface AuthSubmitButtonProps {
  isSubmitting: boolean;
  submittingLabel: string;
  submitLabel: string;
  disabled?: boolean;
}

export function AuthSubmitButton({
  isSubmitting,
  submittingLabel,
  submitLabel,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      className="group/btn h-12 w-full rounded-2xl text-sm font-medium"
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? (
        <>
          <Spinner />
          {submittingLabel}
        </>
      ) : (
        <>
          {submitLabel}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-4 transition-transform group-hover/btn:translate-x-0.5"
          />
        </>
      )}
    </Button>
  );
}
