/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needed for mongoose on Vercel edge/serverless
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
