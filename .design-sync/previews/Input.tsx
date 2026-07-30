import { Input } from "learnhub-ai";

/* Input owns its own label and error text, so every cell below is the whole
 * field — that is the only composition that renders true. Values are passed as
 * defaultValue (uncontrolled) so the cards show filled states without needing
 * React state in a static render. */

export function WithLabel() {
  return (
    <div className="w-full max-w-sm">
      <Input label="Email address" name="email" type="email" placeholder="you@example.com" />
    </div>
  );
}

export function Filled() {
  return (
    <div className="w-full max-w-sm">
      <Input
        label="Full name"
        name="name"
        defaultValue="Amara Okeke"
        placeholder="Your name"
      />
    </div>
  );
}

export function WithError() {
  return (
    <div className="w-full max-w-sm">
      <Input
        label="Password"
        name="password"
        type="password"
        defaultValue="secret"
        error="Use at least 8 characters."
      />
    </div>
  );
}

export function Disabled() {
  return (
    <div className="w-full max-w-sm">
      <Input
        label="Email address"
        name="email-locked"
        defaultValue="amara@learnhub.africa"
        disabled
      />
    </div>
  );
}

/** The real sign-up stack — two fields plus the label rhythm between them. */
export function SignUpForm() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-2xl border border-silver bg-white p-6 shadow-soft">
      <Input label="Email address" name="su-email" type="email" placeholder="you@example.com" />
      <Input label="Password" name="su-password" type="password" placeholder="At least 8 characters" />
    </div>
  );
}
