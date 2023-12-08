/** @type {import('next').NextConfig} */
const nextConfig = {

        experimental: {
            typedRoutes: true,
            serverActions: true,
        },
      webpack: (config) => {
        config.externals = [...config.externals, 'bcrypt','bcryptjs','crypto'];
        return config;
      },

}

module.exports = nextConfig
