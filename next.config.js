// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Enable static exports for Vercel/Netlify if needed
  // output: 'export',
}

module.exports = nextConfig
