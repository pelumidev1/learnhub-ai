"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUp,
    undefined,
  );

  if (state?.message) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="m3 6 9 6 9-6" />
          </svg>
        </div>
        <h2 className="font-display text-lg font-bold text-ink">Check your email</h2>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert>{state.error}</Alert>}
      <Input name="fullName" label="Full name" placeholder="Ada Lovelace" autoComplete="name" required />
      <Input name="email" type="email" label="Email" placeholder="you@email.com" autoComplete="email" required />
      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Button type="submit" loading={pending} className="w-full">
        Create account
      </Button>
    </form>
  );
}
