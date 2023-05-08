const WDM = require('webpack-dev-middleware')
const WHM = require('webpack-hot-middleware')
const browserSync = require('browser-sync').create()
const wait = require('w2t')
const { action } = require('@halfhelix/terminal-kit')
const { checkCookies } = require('./cookie-handling')

function isLocalhost(string) {
  return /localhost/.test(string)
}

let WDMisReady = false

function makeConfig(webpack, settings, watchCallback) {
  const wdm = WDM(webpack, {
    publicPath: settings['path.public'],
    stats: 'errors-warnings',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })

  const config = {
    online: settings['bs.online'],
    proxy: {
      target: settings['bs.target'](settings),
      cookies: {
        stripDomain: false,
        proxyRes: [checkCookies]
      },
      middleware: [wdm]
    },
    open: settings['bs.open']
      ? isLocalhost(settings['bs.local'])
        ? 'internal'
        : 'external'
      : false,
    host: settings['bs.local'],
    https: settings['bs.https'],
    notify: false,
    snippetOptions: {
      rule: settings['bs.snippetPlacement'](settings),
      whitelist: settings['bs.whitelist']
    },
    files: [
      {
        match: [settings.watch(settings)],
        fn: (event, file) => {
          // Don't start listening to file changes until Webpack is ready
          if (!WDMisReady) {
            return
          }
          return watchCallback(event, file, settings).then(
            async (shouldReload) => {
              if (!shouldReload) {
                return
              }
              const spinner = action('Reloading your browser')
              await wait(settings['bs.reloadDelay'] || 0)
              browserSync.reload()
              await wait(500)
              spinner.succeed()
            }
          )
        }
      }
    ],
    logLevel: 'silent'
  }

  if (settings['bs.replaceAssets']) {
    const rules = settings['css.chunk']
      ? settings['bs.proxyReplacements.chunked']
      : settings['bs.proxyReplacements.normal']

    config.rewriteRules = settings['bs.proxyReplacementsFilter'](
      rules,
      settings
    ).map((rule) => {
      return {
        match: rule.regex,
        fn: (req, res, match) => {
          return rule.replacement(settings, req, res, match) || ''
        }
      }
    })
  }

  if (settings['js.hmr']) {
    config.proxy.middleware.push(WHM(webpack))
  }

  return { wdm, config }
}

module.exports = (webpack, settings, watchCallback) => {
  const { wdm, config } = makeConfig(webpack, settings, watchCallback)
  let spinner = false
  wdm.context.compiler.hooks.invalid.tap('kit', () => {
    spinner = action('Rebuilding bundle')
  })
  wdm.context.compiler.hooks.done.tap('kit', () => {
    spinner && spinner.succeed()
  })

  return new Promise((resolve, reject) => {
    browserSync.init(config, (error, bs) => {
      wdm.waitUntilValid(() => {
        WDMisReady = true
        resolve({ bs, wdm })
      })
    })
  })
}
