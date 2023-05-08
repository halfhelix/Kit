---
description: ''
sidebar: 'docs'
prev: '/docs'
next: '/docs'
---

# Updating to Version 2

In May 2022 we pushed a new major version `v2.0.0` to migrate a whole bunch of NPM dependencies together, including migrating from Webpack 4 to Webpack 5. If you are running a previous project and would like to make this transition, please follow these directives.

Ultimately we've tried to make this migration easy. Please post an issue if you have any problems and we can update the docs.

### First, uninstall Kit and re-install the latest version.

Here's an example of how to do this:

`npm i -g @halfhelix/kit@v2.0.0`

or

`npm uninstall -g @halfhelix/kit && npm i -g @halfhelix/kit`

### Update the dependencies of your theme.

Here's an example of how to do this, run this command in your theme directory:

`yarn add --dev node-sass postcss stylelint stylelint-config-standard-scss`

If you would like to use Dart Sass instead, you have the option but be aware that you likely need to change various aspects of your theme's Sass files.

### Update your webpack config.

We need to tell `sass-loader` to look in the theme directory for the Sass compiler to use:

```js
{
  loader: 'sass-loader',
  options: {
    sourceMap: true,
    // Add this line
    implementation: require('node-sass')
  }
}
```

If you are using `{{ 'image.png' | asset_url }}` like declarations in your stylesheets, we need to tell css-loader to ignore urls:

```js
{
  loader: 'css-loader',
  options: {
    // Add this line
    url: false,
    importLoaders: 1,
    sourceMap: true
  }
}
```

### Update your stylelintrc config file.

`stylelint-config-standard` is no longer supported when using Sass, rather use `stylelint-config-standard-scss`. If you have your own stylelint implementation feel free to adjust as needed.

```js
module.exports = {
  // Change this line
  extends: 'stylelint-config-standard-scss'
}
```

### Update your files or your linting rules to cater to a new stylelint'ing setup

There are a couple of ways to do this. First, you can install `stylelint` globally and run the `--fix` directive. This will catch and update a lot but not all. Here's an example:

```bash
stylelint modules/**/*.scss --fix
```

Or for a quick and dirty way to test the upgrade and come back to linting refinement, you can exclude rules in your `stylelintrc` file. Here's an example of a sweeping removal of rules. Again, it's recommended to only enact something like this temporarily. Use the `--fix` command.

```
// ¯\_(ツ)_/¯
module.exports = {
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "selector-class-pattern": "^[a-z0-9-_]+$",
    "selector-id-pattern": null,
    "shorthand-property-no-redundant-values": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "scss/double-slash-comment-empty-line-before": null,
    "scss/at-mixin-argumentless-call-parentheses": null,
    "scss/double-slash-comment-empty-line-before": null,
    "scss/double-slash-comment-whitespace-inside": null,
    "scss/at-extend-no-missing-placeholder": null,
    "scss/dollar-variable-pattern": null,
    "scss/dollar-variable-empty-line-before": null,
    "scss/percent-placeholder-pattern": null,
    "scss/no-global-function-names": null,
    "scss/operator-no-unspaced": null,
    "property-no-vendor-prefix": null,
    "value-no-vendor-prefix": null,
    "selector-no-vendor-prefix": null,
    "no-empty-first-line": null,
    "value-keyword-case": null,
    "color-function-notation": null,
    "alpha-value-notation": null,
    "string-quotes": null,
    "keyframes-name-pattern": null,
    "font-family-name-quotes": null,
    "at-rule-no-unknown": null,
    "at-rule-empty-line-before": null,
    "selector-list-comma-newline-after": null,
    "selector-attribute-quotes": null,
    "rule-empty-line-before": null,
    "no-empty-first-line": null,
    "no-invalid-position-at-import-rule": null,
    "max-line-length": null,
    "no-descending-specificity": null,
    "comment-empty-line-before": null,
    "number-max-precision": null,
    "function-url-quotes": null,
    "no-duplicate-selectors": null, // For critical declarations
    "max-nesting-depth": 3
  }
}
```

### Update the Node version in your Github Action files

You might have been using an older Node version in CI to cater to a `v1.*` version of Kit. Update the Node version to support the newer dependencies we now have in `v2`. Here's an example using Github Actions:

```yaml
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          # Change this line
          node-version: '16.10'
```
