const path = require('path')
const fs = require('fs-extra')

const { CWD } = require('./../constants')

module.exports = {
  // package.json location for the project
  package: fs.existsSync(path.normalize(`${CWD}/package.json`))
    ? require(path.normalize(`${CWD}/package.json`))
    : {},
  // The "kit.config.js" file location (accepts an array)
  'path.config': [path.normalize(`${CWD}/kit.config.js`)],
  // The root of the project
  'path.cwd': path.normalize(`${CWD}`),
  // The location of the Webpack config file
  'path.webpack': path.normalize(`${CWD}/webpack.config.js`),
  // The built theme output directory
  'path.dist': path.normalize(`${CWD}/dist`),
  // The source code directory within the project root
  'path.src': path.normalize(`${CWD}/src`),
  // The HMR in-memory local URL segment
  'path.public': `/dev/`,
  // The HMR path to add to Webpack bundles
  'path.hmr': 'webpack-hot-middleware/client?reload=true',
  // The hardcoded Shopify CDN path to use in local development when shimming the "asset_url" filter
  'path.cdn': 'https://cdn.shopify.com/replace-this',
  // Location for stdout logs when the the current terminal window is bypassed
  'path.stdout': path.normalize(`${CWD}/node_modules/.logs/kit-stdout.log`),
  // Location for stderr logs when the the current terminal window is bypassed
  'path.stderr': path.normalize(`${CWD}/node_modules/.logs/kit-stderr.log`),
  // The temporary directory used for the built theme > source theme repo sync
  'path.temp': path.normalize(`${CWD}/temp`),
  // The file that stores src > built theme file locations in built repo (source repo to built repo sync)
  'path.mapping-json': '.kit-mapping.json'
}
