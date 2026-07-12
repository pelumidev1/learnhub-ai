/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Google account avatars (from OAuth).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Supabase Storage avatars.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
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
