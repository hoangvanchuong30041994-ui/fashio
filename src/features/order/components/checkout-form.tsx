'use client';

import { useActionState } from 'react';
import { createOrderAction } from '@/features/order/actions/create-order';
import type { Locale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function CheckoutForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    title: string;
    name: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    country: string;
    note: string;
    submit: string;
    submitting: string;
    errors: Record<string, string>;
  };
}) {
  const [state, formAction, isPending] = useActionState(createOrderAction.bind(null, locale), {
    ok: false,
  });

  return (
    <form action={formAction} className="space-y-5 rounded-[1.75rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
      <h2 className="text-xl font-semibold">{labels.title}</h2>

      {state.code ? (
        <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {labels.errors[state.code] ?? labels.errors.unknown}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.name}</span>
          <Input name="name" required minLength={2} className="h-11 rounded-2xl" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.phone}</span>
          <Input name="phone" required minLength={8} className="h-11 rounded-2xl" />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.street}</span>
        <Input name="street" required minLength={5} className="h-11 rounded-2xl" />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.ward}</span>
          <Input name="ward" className="h-11 rounded-2xl" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.district}</span>
          <Input name="district" required minLength={2} className="h-11 rounded-2xl" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.province}</span>
          <Input name="province" required minLength={2} className="h-11 rounded-2xl" />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.country}</span>
        <Input name="country" defaultValue="VN" required className="h-11 rounded-2xl" />
      </label>

      <label className="space-y-2 block">
        <span className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.note}</span>
        <Textarea name="note" className="min-h-28 rounded-2xl" />
      </label>

      <Button type="submit" disabled={isPending} className="h-12 w-full rounded-2xl">
        {isPending ? labels.submitting : labels.submit}
      </Button>
    </form>
  );
}
