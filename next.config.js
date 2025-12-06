/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://item-question-service-166647007319.europe-west1.run.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;