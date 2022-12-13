/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  async redirects() {
    const url = process.env.NEXT_PUBLIC_REDIRECT_URL;

    if (url) {
      return ["/", "/systems/:id", "/systems/register"].map((source) => ({
        source,
        destination: url,
        permanent: true,
      }));
    }

    return [];
  },
};

module.exports = nextConfig;
