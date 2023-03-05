/** @type {import('next').NextConfig} */
// see https://github.com/martpie/next-transpile-modules#readme
const withTM = require('next-transpile-modules')([
  // "ethtps.pages",
  // "ethtps.components",
  'ethtps.data',
  'ethtps.api.client'
])

module.exports = withTM({
  reactStrictMode: true,
  env: {
    ETHTPS_API_URL: process.env.ETHTPS_API_URL,
    ETHTPS_WS_URL: process.env.ETHTPS_WS_URL
  }
})
