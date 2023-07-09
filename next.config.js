const withMDX = require('@next/mdx')({
  // ...
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})
const withTM = require('next-transpile-modules')([
  // '@visx/scale'
])

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  distDir: 'build',
  compiler: {
    styledComponents: true
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

module.exports = withTM(withMDX({
  experimental: {
    appDir: true,
    cpus: 8,
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )


    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i
    return config
  }
}))