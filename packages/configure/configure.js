const yaml = require('js-yaml')
const fs = require('fs-extra')
const { warning } = require('@halfhelix/terminal-kit')

require('dotenv').config()

const defaults = require('./src/defaults')
const utils = require('./src/utils')
const emitter = require('./src/emitter')

function readConfigFiles() {
  const config = defaults['path.config'].reduce((obj, path) => {
    if (!fs.existsSync(path)) {
      return obj
    }

    if (~path.indexOf('yml')) {
      return yaml.safeLoad(fs.readFileSync(path))
    } else {
      return require(path)
    }
  }, {})

  if (fs.existsSync(defaults['path.webpack'])) {
    config._webpack = require(defaults['path.webpack'])
  }

  return config
}

function validateConfig(config, env) {
  if (!config.themes || !config.themes[env]) {
    throw new Error(`No settings for current env: ${env}`)
  }
}

async function getDeveloperTheme() {
  const branch = await defaults['git.getBranch'](defaults, utils.getBranch)
  const themeLog = utils.readThemeLogFile(defaults)
  if (themeLog[branch]) {
    return { theme: themeLog[branch] }
  } else {
    warning(`Developer theme ID for "${branch}" not found`)
    warning(`Falling back to kit.config.js theme`)
  }
}

module.exports = async (options) => {
  Object.assign(defaults, options)

  process.env.NODE_ENV = options.env

  const config = readConfigFiles()
  validateConfig(config, options.env)

  Object.assign(
    defaults,
    config,
    config.themes[options.env],
    options,
    options.isDeveloper ? await getDeveloperTheme() : {},
    emitter,
    {
      'runtime.npmPrefix': await utils.getNPMPrefix()
    }
  )
  return defaults
}

module.exports.settings = defaults
module.exports.utils = utils
