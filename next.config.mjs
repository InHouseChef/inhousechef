/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    redirects: async () => {
        return [
            {
                source: '/', // The old URL path
                destination: '/home', // The new URL path
                permanent: true, // This is a permanent redirect (status code 308)
            },
            // Add more redirects as needed
        ]
    }
}

export default nextConfig