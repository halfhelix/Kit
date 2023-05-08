const webpack = require('webpack')
const path = require('path')
const fs = require('fs-extra')
const wait = require('w2t')
const {
  log,
  action,
  error,
  webpackResponse,
  browserSyncNotice,
  box,
  title,
  subtitle,
  color,
  completedAction
} = require('@halfhelix/terminal-kit')
const config = require('./src/generateWebpackConfig')
const setUpProxy = require('./src/setUpProxy')
const lint = require('./src/lint')
const { interceptConsole, resetConsole, getLogs } = require('./src/console')

function cleanseCompiledFileName(filePath) {
  return path.normalize(filePath.split('?').shift())
}

function getCompiledFilePaths(stats) {
  const json = stats.toJson()
  return Object.keys(json.assetsByChunkName).reduce((array, key) => {
    if (typeof json.assetsByChunkName[key] !== 'string') {
      array = array.concat(
        json.assetsByChunkName[key].map((name) =>
          cleanseCompiledFileName(`${json.outputPath}/${name}`)
        )
      )
    } else {
      array.push(
        cleanseCompiledFileName(
          `${json.outputPath}/${json.assetsByChunkName[key]}`
        )
      )
    }
    return array
  }, [])
}

function writeToLogFile(stats, settings) {
  fs.outputJsonSync(`${settings['path.cwd']}/webpack.kit.log`, stats.toJson(), {
    spaces: 2
  })
}

function webpackHasErrors(webpackError, webpackStats) {
  return (
    webpackError ||
    (webpackStats.toJson().errors.length ? webpackStats.toJson().errors : false)
  )
}

async function compileWithWebpack(settings) {
  if (settings['debug.bypassWebpack']) {
    return Promise.resolve([])
  }

  const spinner = action('Compiling assets with Webpack')
  !settings.quick && (await wait(1000))

  return new Promise((resolve, reject) => {
    !settings.debug && interceptConsole()

    const compiler = webpack(config(settings))

    compiler.run(async (error, stats) => {
      if (settings['debug.writeWebpackOutputToFile']) {
        writeToLogFile(stats, settings)
      }

      !settings.debug && resetConsole(false)
      spinner.succeed()

      const hasErrors = webpackHasErrors(error, stats)
      if (hasErrors) {
        return reject(hasErrors)
      }

      webpackResponse(stats, settings)
      !settings.quick && (await wait(1000))

      compiler.close((_error) => {
        // https://webpack.js.org/api/node/#close-watching
        // Not clear on what type of error would be returned
        // as part of this call.
        _error && console.log(_error)
        resolve(getCompiledFilePaths(stats), settings)
      })
    })
  }).catch((e) => {
    console.log(e)
    error(e, true, true)
    return Promise.resolve(false)
  })
}

module.exports = (settings) => {
  return compileWithWebpack(settings)
}

module.exports.critical = async (settings, watchCallback) => {
  await warnInCriticalAndConditionallyExit(settings)
  interceptConsole()
  const watching = webpack(config(settings)).watch({}, (_error, stats) => {
    resetConsole(false)
    const hasErrors = webpackHasErrors(_error, stats)
    if (hasErrors) {
      return error(hasErrors, true)
    }
    webpackResponse(stats, settings)
    watchCallback(getCompiledFilePaths(stats))
    settings.close && watching.close()
  })
}

const warnInCriticalAndConditionallyExit = async (settings) => {
  const spinner = action('Checking Kit critical settings')
  !settings.quick && (await wait(1000))
  spinner.succeed()

  box(
    title('Notice:'),
    subtitle(
      `css.chunk is set to: ${color(
        settings['css.chunk'] ? 'green' : 'red',
        settings['css.chunk']
      )}`
    ),
    subtitle(
      `css.chunk.critical is set to: ${color(
        settings['css.chunk.critical'](settings) ? 'green' : 'red',
        settings['css.chunk.critical'](settings)
      )}`
    )
  )
  if (!settings['css.chunk.critical'](settings) || !settings['css.chunk']) {
    process.exit()
  } else {
    completedAction('Passed! Continuing with command')
  }
}

module.exports.watch = async (settings, watchCallback) => {
  let spinner = action('Starting up BrowserSync proxy server')

  await wait(1000)
  spinner.succeed()

  spinner = action('Compiling with Webpack')

  interceptConsole()

  const { bs } = await setUpProxy(
    webpack(config(settings)),
    settings,
    watchCallback
  )

  resetConsole()
  const { stderr } = await getLogs()

  spinner.succeed()
  browserSyncNotice({
    target: settings['bs.target'](settings),
    proxy: bs.options.getIn(['urls', 'local'])
  })

  // Print any errors that come up during compilation
  log(stderr)

  return Promise.resolve()
}

module.exports.lint = (options, settings) => {
  return lint(options, settings)
}
