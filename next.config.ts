/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    // Cache optimised images for 31 days — drastically reduces repeat-visit LCP
    minimumCacheTTL: 2678400,
    // Inline images below 8KB to save a round-trip
    contentDispositionType: "inline",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "react-icons"],
  },
};

module.exports = nextConfig;
