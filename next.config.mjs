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
};

export default nextConfig;
