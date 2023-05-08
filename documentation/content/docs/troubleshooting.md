---
description: ''
sidebar: 'docs'
prev: '/docs'
next: '/docs'
---

# Troubleshooting

## Installation troubleshooting

In order to install this package we write to the local computer directory that is set to store NPM global packages.

If there is an issue with permissions for this global directory, or issues with Sass having been built for another version of Node, issues may arise in the installation process.

### Node Sass binding issues

If you run into an error relating to Node Sass about non-compatible binaries "Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js" you may need to rebuild node-sass from within the kit node_modules folder:

```bash
# For Mac OSX Users
cd "$(npm root -g)/@halfhelix/kit" && npm rebuild node-sass;
```

\_Note: As of version 2.0.0, `node-sass` has been removed as a dependency of this Kit, the theme project itself can determine to use Dart Sass or Node Sass and managed the dependency.

### Permission issues

See [this link](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) on resolving permission issues when installing global packages.
