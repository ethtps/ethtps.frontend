# ethtps.frontend.

v2 version of the frontend

# Component diagram

![component](/assets/component%20diagram.png)

# Setup

1. Build `ethtps.api.client`

`cd ethtps.api.client`

`yarn install`

`npx tsc`

2. Link `ethtps.api.client` to `ethtps.data`

`cd ethtps.data`

`npx relative-deps`

`yarn add ../ethtps.api.client`

3. Build `ethtps.data`

`yarn install`

`npx tsc`

4. Link `ethtps.data` to `ethtps.frontend.v2`

`cd ethtps.frontend.v2`

`npx relative-deps`

5. Build `ethtps.frontend.v2`

`yarn install`

`npx tsc ethtps.frontend.v2`

Done! Start with

`npm run dev`