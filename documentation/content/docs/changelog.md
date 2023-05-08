---
description: ''
sidebar: 'docs'
prev: '/docs'
next: '/docs'
---

# Changelog

## v2.0.0

This is a major release with breaking changes. The key focus one this release is to update dependencies and support Node versions 15+

See below for necessary changes to your projects.

### Some dependencies moved into project package.json

Some NPM dependencies have been moved into the package.json of the project using Kit rather being automatically installed by Kit.

```
# Run the following
npm install --save-dev stylelint@14.6.1
npm install --save-dev postcss@8.4.12
```

### .stylelintrc.js

Updating stylelint to v14 requires an update to stylelint config when handling linting over sass. Update `.stylelintrc.js` to use [stylelint-config-standard-scss](https://stylelint.io/migration-guide/to-14/).

```
// .stylelintrc.js example
module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    'selector-class-pattern': '^[a-z-_]+$',
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'max-nesting-depth': 2
  }
}
```

Run `npm install --save-dev stylelint-config-standard-scss` in your project and remove the existing `stylelint-config-standard` dependency.

### Other notes

A non-standard forked version of `webpack-hot-middleware` was added to `@halfhelix/webpacker` since there are known issues with Webpack 5.0 compatibility and reloading (see Github issue thread [here](https://github.com/webpack-contrib/webpack-hot-middleware/issues/390)). We hope to follow up with an update to an official version if the open issue is resolved.
