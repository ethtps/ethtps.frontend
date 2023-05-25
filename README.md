# ethtps.frontend

v2 version of the frontend (<1.5 really)

[![Node.js build](https://github.com/ethtps/ethtps.frontend/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/ethtps/ethtps.frontend/actions/workflows/node.js.yml)

[![Prettier test](https://github.com/ethtps/ethtps.frontend/actions/workflows/node.js.lint.yml/badge.svg?branch=main)](https://github.com/ethtps/ethtps.frontend/actions/workflows/node.js.lint.yml)

# Setup

typical

`yarn install`

`npm run start:dev`

Everything's still a mess - it will be improved at some point in the future  ¯\\_(ツ)_\/¯

# Notes

- If the page never loads while opening the development environment locally, it is because Next can't access the backend in order to statically generate the pages. To fix this, you can either:
  
  - Run the backend locally
  
  - Point the frontend to `https://api.ethtps.info`