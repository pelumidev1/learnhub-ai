/** @type {import('next').NextConfig} */
const nextConfig = {
  // The certificate routes read their fonts (and the signature, once there is
  // one) from disk at request time. Listed here so the deployment bundles
  // them; a path built with join() is not something the tracer can follow.
  outputFileTracingIncludes: {
    "/verify/**": ["./lib/certificate/fonts/**", "./public/brand/signature*"],
  },
  images: {
    remotePatterns: [
      // Google account avatars (from OAuth).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Supabase Storage avatars.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    return [
      // The waitlist lives at /enrol; /waitlist is the name people will guess
      // and type. Not permanent (307), so the alias can be repointed later
      // without browsers holding onto a cached 308 forever.
      { source: "/waitlist", destination: "/enrol", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Stop MIME-sniffing responses into executable types.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // The app is never embedded — block framing (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // We use none of these browser capabilities.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
