"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert>{state.error}</Alert>}
      <Input
        name="password"
        type="password"
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        name="confirm"
        type="password"
        label="Confirm password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Button type="submit" loading={pending} className="w-full">
        Update password
      </Button>
    </form>
  );
}
