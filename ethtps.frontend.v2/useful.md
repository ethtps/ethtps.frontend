When adding a new project that exports React components, it needs to be referenced using yarn:

`yarn add file:../new.dependency`

`npx relative-deps ../new.dependency`

Then it needs to be added to the `next.config.js` file in order for it to be transpiled:

`const withTM = require("next-transpile-modules")([
    ...,
    "new.dependency"
]);`
