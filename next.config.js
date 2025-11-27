/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  images: {
    // Add 80 to your allowed qualities
    qualities: [75, 80], 
  },
}

module.exports = nextConfig