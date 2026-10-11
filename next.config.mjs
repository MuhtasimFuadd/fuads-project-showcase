/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Project covers are uploaded to Supabase Storage (or pasted as URLs from
    // anywhere), so allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  }
};

export default nextConfig;
