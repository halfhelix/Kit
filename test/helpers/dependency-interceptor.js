const { addHook } = require('pirates')
const webpackResponse = require('./../../packages/webpacker/test/mocks/webpack-response')

addHook(
  () => {
    return `
  module.exports = () => Promise.resolve()
  `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return !!~filename.indexOf('w2t')
    }
  }
)

addHook(
  () => {
    return `
  module.exports = {
    log () {},
    action () {
      return {
        succeed () {},
        fail () {}
      }
    },
    completedAction () {},
    genericListBox () {},
    error (error, log = true, exit = false) {
      log && console.log('error: ')
      log && console.log(error)
      exit && process.exit()
    },
    uploadErrors () {},
    webpackResponse () {},
    browserSyncNotice () {},
    title () {},
    subtitle () {},
    color () {},
    box () {},
    progressBar () {
      return () => {}
    }
  }
  `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return !!~filename.indexOf('terminal-kit/terminal-kit.js')
    }
  }
)

addHook(
  (code, filename) => {
    return `
      module.exports = function () {
        this.name = '${filename}'
      }
      module.exports.extract = function () {}
  `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return (
        !!~filename.indexOf('babel-minify-webpack-plugin') ||
        !!~filename.indexOf('extract-text-webpack-plugin') ||
        !!~filename.indexOf('stylelint-webpack-plugin') ||
        !!~filename.indexOf('dynamic-public-path-webpack-plugin') ||
        !!~filename.indexOf('autoprefixer')
      )
    }
  }
)

addHook(
  () => {
    return `
      const sinon = require('sinon')
      global.webpackSettingsStub = sinon.stub()
      module.exports = function (config) {
        global.webpackSettingsStub(config)
        return {
          run (callback) {
            callback(false, {
              toJson () {
                return ${JSON.stringify(webpackResponse)}
              }
            })
          },
          close (callback) {
            callback()
          }
        }
      }
      module.exports.NoEmitOnErrorsPlugin = function () {
        this.name = 'NoEmitOnErrorsPlugin'
      }
      module.exports.DefinePlugin = function () {
        this.name = 'DefinePlugin'
      }
      module.exports.SourceMapDevToolPlugin = function () {
        this.name = 'SourceMapDevToolPlugin'
      }
      module.exports.HotModuleReplacementPlugin = function () {
        this.name = 'HotModuleReplacementPlugin'
      }
  `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return !!~filename.indexOf('node_modules/webpack')
    }
  }
)

addHook(
  () => {
    return `
      module.exports = function (config) {
        return {
          context: {
            compiler: {
              hooks: {
                invalid: {
                  tap () {}
                },
                done: {
                  tap () {}
                }
              }
            }
          },
          waitUntilValid (callback) {
            callback()
          }
        }
      }
    `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return !!~filename.indexOf('node_modules/webpack-dev-middleware')
    }
  }
)

addHook(
  () => {
    return `
      module.exports = function (config) {}
    `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return !!~filename.indexOf('node_modules/webpack-hot-middleware')
    }
  }
)

addHook(
  () => {
    return `
      module.exports = function () {}
      module.exports.create = function () {
        return {
          init (config, callback) {
            callback(false, {
              options: {
                getIn () {}
              }
            })
          }
        }
      }
    `
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher(filename) {
      return !!~filename.indexOf('node_modules/browser-sync')
    }
  }
)
