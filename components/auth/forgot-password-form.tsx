"use client";

import { useActionState } from "react";
import { forgotPassword, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    forgotPassword,
    undefined,
  );

  if (state?.message) {
    return <Alert variant="success">{state.message}</Alert>;
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert>{state.error}</Alert>}
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@email.com"
        autoComplete="email"
        required
      />
      <Button type="submit" loading={pending} className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
