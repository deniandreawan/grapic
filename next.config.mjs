import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "replicate.delivery", "images.grapic.workers.dev"]
  },
}

export default nextConfig
