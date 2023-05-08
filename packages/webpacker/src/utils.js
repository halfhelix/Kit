const path = require('path')
const fs = require('fs-extra')

function getEnv(settings) {
  return settings.env === 'development' ? 'development' : 'production'
}

function getThemeNodeModulesDir(suffix = '', settings) {
  const THEME_NODE_MODULES = path.normalize(
    `${settings['path.cwd']}/node_modules${suffix}`
  )
  return fs.existsSync(THEME_NODE_MODULES) ? THEME_NODE_MODULES : ''
}

/**
 * 1. Checks the existence of the package in the relative node_modules dir
 * 2. Checks the existence of the package in the global npm dir
 */
function getPackageNodeModulesDir(suffix = '', settings) {
  const RELATIVE_NODE_MODULES = path.normalize(
    path.resolve(__dirname, `../node_modules${suffix}`)
  )
  const GLOBAL_NODE_MODULES = path.normalize(
    `${settings['runtime.npmPrefix']}/lib/node_modules${suffix}`
  )

  return fs.existsSync(RELATIVE_NODE_MODULES)
    ? RELATIVE_NODE_MODULES
    : fs.existsSync(GLOBAL_NODE_MODULES)
    ? GLOBAL_NODE_MODULES
    : ''
}

function preferThemeNodeModuleFolder(suffix = '', settings) {
  return (
    getThemeNodeModulesDir(suffix, settings) ||
    getPackageNodeModulesDir(suffix, settings) ||
    ''
  )
}

const matchLoader = (name) => (loaderRule) => {
  if (typeof loaderRule === 'string') {
    return ~loaderRule.indexOf(name)
  }

  return ~loaderRule.loader.indexOf(name)
}

/**
 * Use "css-loader" as the flag to determine if this is the
 * Webpack config module rule that relates to CSS rule
 */
function isCSSModuleLoaderRule(rule) {
  return findAndOptionallyCleanseLoader(rule, 'css-loader', false)
}

/**
 * The intent of this obscure function is to replace
 * a found module loader, either in the "loader" property
 * or in the "use: [ ... ]" property so that we have a
 * clean slate to re-add it in in the way that we want to.
 *
 */
function findAndOptionallyCleanseLoader(rule, name, cleanse = true) {
  if (rule.loader === name) {
    cleanse && delete rule.loader
    return true
  }

  const isInUse = (rule.use || []).findIndex(matchLoader(name))

  if (~isInUse) {
    cleanse && rule.use.splice(isInUse, 1)
    return true
  }

  return false
}

module.exports = {
  getEnv,
  getThemeNodeModulesDir,
  getPackageNodeModulesDir,
  preferThemeNodeModuleFolder,
  matchLoader,
  isCSSModuleLoaderRule,
  findAndOptionallyCleanseLoader
}
