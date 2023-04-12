const withTM = require('next-transpile-modules')([
])
const config = {
  reactStrictMode: true,
  experimental: { esmExternals: true }
}

module.exports = withTM(config)
