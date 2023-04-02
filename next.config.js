/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['d3-scale'])
module.exports = withTM({
  reactStrictMode: true
})
