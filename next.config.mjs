/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        domains: ['s3.eu-central-1.amazonaws.com']
    }
}

export default nextConfig
