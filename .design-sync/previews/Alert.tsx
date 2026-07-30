import { Alert, Button, Input } from "learnhub-ai";

/* Alert is the auth and assessment feedback surface. Messages are the real
 * ones the product shows — plain, specific, never blaming the user. */

export function Error() {
  return (
    <div className="w-full max-w-sm">
      <Alert>That email and password don&rsquo;t match. Try again.</Alert>
    </div>
  );
}

export function Success() {
  return (
    <div className="w-full max-w-sm">
      <Alert variant="success">
        Check your inbox — we sent you a link to reset your password.
      </Alert>
    </div>
  );
}

export function LongMessage() {
  return (
    <div className="w-full max-w-sm">
      <Alert>
        We couldn&rsquo;t reach the server. Your answers are saved, so you can pick up
        where you left off once you&rsquo;re back online.
      </Alert>
    </div>
  );
}

/** Where it actually appears: above the fields in the sign-in form. */
export function InForm() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-2xl border border-silver bg-white p-6 shadow-soft">
      <Alert>That email and password don&rsquo;t match. Try again.</Alert>
      <Input label="Email address" name="al-email" type="email" defaultValue="amara@learnhub.africa" />
      <Input label="Password" name="al-password" type="password" placeholder="Your password" />
      <Button className="w-full">Sign in</Button>
    </div>
  );
}
