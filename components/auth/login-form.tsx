"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signIn,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert>{state.error}</Alert>}
      <input type="hidden" name="redirect" value={redirectTo ?? "/dashboard"} />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@email.com"
        autoComplete="email"
        required
      />
      <div>
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-blue hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <Button type="submit" loading={pending} className="w-full">
        Log in
      </Button>
    </form>
  );
}
