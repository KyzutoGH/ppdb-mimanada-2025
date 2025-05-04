/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Add your domain here
  },
  // Allow serving files from uploads directory
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;