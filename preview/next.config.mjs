/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Engedjük, hogy a Next a projektgyökér alatti TS/TSX fájlokat is transpile-olja
    externalDir: true,
  },
};

export default nextConfig;


