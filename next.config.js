const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Your existing Next.js config here
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = withPWA(nextConfig);
