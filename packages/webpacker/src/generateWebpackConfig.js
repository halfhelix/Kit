const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const autoprefixer = require('autoprefixer')
const cloneDeep = require('lodash.clonedeep')

const {
  getEnv,
  getPackageNodeModulesDir,
  preferThemeNodeModuleFolder,
  matchLoader,
  isCSSModuleLoaderRule,
  findAndOptionallyCleanseLoader
} = require('./utils')

/**
 * Sets 'devtool' to false if the 'watch'
 * command is running which is the flag to
 * determine if the developer is in development.
 */
function prepareDevtool(settings) {
  if (settings.task !== 'watch') {
    return false
  } else {
    return settings.webpack.devtool
  }
}

/**
 * Adds in the settings['path.hmr'] setting if
 * in development and removes all but css if we
 * are running the 'critical' task.
 */
function prepareEntry(settings) {
  const { entry } = settings.webpack

  if (!~['critical', 'watch'].indexOf(settings.task) || !settings['js.hmr']) {
    return entry
  }

  if (typeof entry === 'string') {
    return _mutateEntry([entry], settings)
  }

  return Object.keys(entry).reduce((obj, key) => {
    if (typeof entry[key] === 'string') {
      obj[key] = [entry[k]]
    } else {
      obj[key] = entry[key]
    }
    obj[key] = _mutateEntry(obj[key], settings)
    return obj
  }, {})
}

function _mutateEntry(entry, settings) {
  if (settings.task === 'watch') {
    entry.push(settings['path.hmr'])
  }

  if (settings.task === 'critical') {
    entry = entry.filter((file) => /s?css|sass|less/.test(file))
  }

  return entry
}

/**
 * Handles the 'output' property of the config file
 */
function prepareOutput(settings) {
  return Object.assign({}, settings.webpack.output, {
    publicPath: settings['path.public']
  })
}

/**
 * Handles the 'resolve' property of the config file.
 * Here we tell webpack where to look for packages in:
 * essentially within the context of the project, in the
 * context of @kit or in the the global NPM node_modules
 * folder.
 */
function prepareResolve(settings) {
  return Object.assign(
    {
      modules: [getPackageNodeModulesDir('', settings), 'node_modules']
    },
    settings.webpack.resolve || {}
  )
}

/**
 * Handles the 'resolveLoader' property of the config file.
 *
 * Here we tell webpack where to look for packages in:
 * essentially within the context of the project, in the
 * context of @kit or in the the global NPM node_modules
 * folder.
 */
function prepareResolveLoader(settings) {
  return {
    modules: [getPackageNodeModulesDir('', settings), 'node_modules']
  }
}

/**
 * We iterate through all of the module rules
 * and mutate then accordingly to the functions below.
 *
 * We do this to handle JS and CSS inline with the
 * opinions of this package - with the intention of
 * taking a lot of the setup pain points away from
 * project setup (and standardizing the approach across
 * many projects).
 */
function prepareModule(settings) {
  const webpackModules = cloneDeep(settings.webpack.module)

  if (!webpackModules.rules) {
    throw new Error('webpack.module must have "rules" property')
  }

  webpackModules.rules.map((rule) => {
    _addCSSExtractPlugin(rule, settings)
    _addEslintConfig(rule, settings)
    _addCustomJsLoaders(rule, settings)
    _addCustomStyleLoaders(rule, settings)
  })

  return webpackModules
}

function _addCSSExtractPlugin(rule, settings) {
  if (!isCSSModuleLoaderRule(rule)) {
    return
  }

  let { use } = rule

  if (settings.task === 'watch') {
    return
  }

  if (!Array.isArray(use)) {
    throw new Error('webpack.module.rules.use must be array')
  }
  if (use.length < 2) {
    throw new Error('webpack.module.rules.use must have a min length of 2')
  }

  rule.use = [MiniCssExtractPlugin.loader, ...use]
}

function _addEslintConfig(rule, settings) {
  if (!findAndOptionallyCleanseLoader(rule, 'eslint-loader')) {
    return
  }
  rule.loader = preferThemeNodeModuleFolder('/eslint-loader', settings)
  rule.options = {
    eslintPath: preferThemeNodeModuleFolder('/eslint', settings),
    ...(rule.options || {})
  }
}

function _addCustomJsLoaders(rule, settings) {
  if (!findAndOptionallyCleanseLoader(rule, 'babel-loader')) {
    return
  }
  rule.use = [
    {
      loader: preferThemeNodeModuleFolder('/babel-loader', settings),
      options: {
        ...settings.babel,
        ...(rule.options || {})
      }
    },
    {
      loader: getPackageNodeModulesDir('/@halfhelix/glob-loader', settings),
      options: {
        'path.src': settings['path.src'],
        autoChunk: settings['js.autoChunk'],
        sortFunction: settings['js.chunkSortFunction'],
        chunkNameFilter: settings['js.chunkNameFilter']
      }
    }
  ]
}

function _addCustomStyleLoaders(rule, settings) {
  if (!isCSSModuleLoaderRule(rule)) {
    return
  }

  // extract is no longer necessary to have
  // on the rule as a flag so just delete it
  // if it exists.
  typeof rule.extract && delete rule.extract

  if (settings.task !== 'watch') {
    findAndOptionallyCleanseLoader(rule, 'style-loader')
  }

  rule.use.push({
    loader: getPackageNodeModulesDir('/@halfhelix/glob-loader', settings),
    options: {
      'path.src': settings['path.src'],
      sortFunction: settings['js.chunkSortFunction']
    }
  })

  function sassIndex() {
    return rule.use.findIndex(matchLoader('sass-loader'))
  }

  if (~sassIndex()) {
    if (settings['shopify.addShopifyLoader'] && settings.task === 'watch') {
      rule.use.splice(sassIndex(), 0, {
        loader: getPackageNodeModulesDir(
          '/@halfhelix/shopify-loader',
          settings
        ),
        options: {
          'path.cdn': settings['path.cdn']
        }
      })
    }

    if (settings['css.autoprefixInWatch'] || settings.task !== 'watch') {
      rule.use.splice(sassIndex(), 0, {
        loader: getPackageNodeModulesDir('/postcss-loader', settings),
        options: {
          postcssOptions: {
            plugins: [autoprefixer]
          }
        }
      })
    }
  }

  rule.use.map((set) => {
    if (
      !/^\\/.test(set.loader) &&
      ~['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'].indexOf(
        set.loader
      )
    ) {
      set.loader = preferThemeNodeModuleFolder(`/${set.loader}`, settings)
    }
  })
}

/**
 * Handles the "plugins" property of the config.
 */
function preparePlugins(settings) {
  return [
    ...(settings.webpack.plugins || []),
    ...(settings['css.lintStyles']
      ? [
          new StyleLintPlugin({
            stylelintPath: preferThemeNodeModuleFolder('/stylelint', settings),
            files: settings['css.stylelintPaths'](settings)
          })
        ]
      : []),
    ...(settings.task === 'watch'
      ? [new webpack.SourceMapDevToolPlugin()]
      : [
          new MiniCssExtractPlugin({
            filename: settings['css.mainFileName']
          })
        ]),
    ...(settings.task === 'watch' && settings['js.hmr']
      ? [new webpack.HotModuleReplacementPlugin()]
      : []),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(getEnv(settings)),
      DEBUG: getEnv(settings) === 'development',
      KIT_VERSION: JSON.stringify(settings.package.version)
    })
  ]
}

/**
 * Handles the "external" property of the config. Essentially
 * passes them through.
 *
 * @max I am not convinced this is necessary the
 * ...remaining line below.
 */
function prepareExternals(settings) {
  return Object.assign({}, settings.webpack.externals)
}

module.exports = (settings) => {
  settings.webpack =
    typeof settings._webpack === 'function'
      ? settings._webpack(webpack)
      : settings._webpack

  const {
    devtool,
    entry,
    output,
    resolve,
    resolveLoader,
    plugins,
    externals,
    module,
    ...remaining
  } = settings.webpack

  const webpackConfig = {
    mode: settings['js.filterWebpackMode'](getEnv(settings), settings),
    devtool: settings['js.filterWebpackDevTool'](
      prepareDevtool(settings),
      settings
    ),
    entry: prepareEntry(settings),
    output: prepareOutput(settings),
    resolve: prepareResolve(settings),
    resolveLoader: prepareResolveLoader(settings),
    plugins: preparePlugins(settings),
    externals: prepareExternals(settings),
    module: prepareModule(settings),
    output: {
      publicPath: 'auto'
    },
    infrastructureLogging: {
      level: 'none'
    },
    ...remaining
  }

  return settings['js.filterWebpackConfig'](webpackConfig, settings)
}
