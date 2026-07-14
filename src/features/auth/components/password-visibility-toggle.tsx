'use client';

import { EyeIcon, EyeOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { InputGroupButton } from '@/components/ui/input-group';

type PasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
  ariaLabelShow: string;
  ariaLabelHide: string;
};

export function PasswordVisibilityToggle({
  visible,
  onToggle,
  ariaLabelShow,
  ariaLabelHide,
}: PasswordVisibilityToggleProps) {
  return (
    <InputGroupButton
      type="button"
      size="icon-sm"
      onClick={onToggle}
      aria-label={visible ? ariaLabelHide : ariaLabelShow}
      aria-pressed={visible}
    >
      <HugeiconsIcon
        icon={visible ? EyeOffIcon : EyeIcon}
        strokeWidth={1.5}
        className="size-4"
      />
    </InputGroupButton>
  );
}
