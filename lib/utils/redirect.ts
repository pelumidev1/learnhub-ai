/**
 * Only allow same-site relative paths for post-auth redirects. Anything else —
 * "//evil.com" (protocol-relative), "https://…", "@evil.com" (parsed as
 * userinfo when appended to an origin), backslash variants — falls back, so an
 * auth link can never bounce someone to another site (open redirect).
 */
export function safeInternalPath(
  path: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }
  return path;
}

/**
 * Whether a caught error is Next's way of saying "this Server Action
 * redirected".
 *
 * `redirect()` works by throwing, and the throw crosses the Server Action
 * boundary to the caller. So any client that wraps an action in try/catch to
 * report failure catches its successes too, and reports a working redirect as
 * an error. The digest is the only thing distinguishing them.
 */
export function isRedirectError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest: unknown }).digest === "string" &&
    (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}
