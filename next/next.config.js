/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable the React DevTools profiler
    profiler: true,
    // TODO to be replaced with actual images host
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            },
        ],
    },
}

module.exports = nextConfig;