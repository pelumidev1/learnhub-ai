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
