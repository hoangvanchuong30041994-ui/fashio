'use client';

import { useCallback, useState } from 'react';
import type { FieldValues, Path, UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import type { AuthErrorCode } from '@/auth/constants/auth-error-codes';
import { INITIAL_AUTH_ACTION_STATE } from '@/auth/types/auth-action-state';
import type { AuthActionState } from '@/auth/types/auth-action-state';
import type { Locale } from '@/i18n/routing';

type AuthServerAction = (
  locale: Locale,
  prevState: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

type UseAuthFormSubmitOptions<TValues extends FieldValues> = {
  locale: Locale;
  action: AuthServerAction;
  createFormDataAction: (values: TValues) => FormData;
  clearErrorsAction: UseFormClearErrors<TValues>;
  setErrorAction: UseFormSetError<TValues>;
};

export function useAuthFormSubmit<TValues extends FieldValues>({
  locale,
  action,
  createFormDataAction,
  clearErrorsAction,
  setErrorAction,
}: UseAuthFormSubmitOptions<TValues>) {
  const [formError, setFormError] = useState<AuthErrorCode>();

  const submit = useCallback(
    async (values: TValues) => {
      clearErrorsAction();
      setFormError(undefined);

      const result = await action(locale, INITIAL_AUTH_ACTION_STATE, createFormDataAction(values));

      for (const [field, codes] of Object.entries(result.fieldErrors)) {
        const message = codes?.[0];

        if (!message) {
          continue;
        }

        setErrorAction(field as Path<TValues>, {
          type: 'server',
          message,
        });
      }

      setFormError(result.formError);
    },
    [action, clearErrorsAction, createFormDataAction, locale, setErrorAction],
  );

  return {
    formError,
    submit,
  };
}
