/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
