const eslint = require('eslint')
const { completedAction } = require('@halfhelix/terminal-kit')
const { preferThemeNodeModuleFolder } = require('./utils')

module.exports = ({ fix, include }, settings) => {
  return Promise.all([
    ~include.indexOf('css') ? lintCSS(fix, settings) : Promise.resolve(false),
    ~include.indexOf('js')
      ? lintJavascript(fix, settings)
      : Promise.resolve(false)
  ]).then(([cssError, jsError]) => {
    if (cssError || jsError) {
      process.exitCode = 1
    }
    return Promise.resolve()
  })
}

const lintJavascript = (fix, settings) => {
  const CLIEngine = eslint.CLIEngine
  const cli = new CLIEngine({
    fix
  })
  const report = cli.executeOnFiles([`${settings['path.src']}/`])
  const formatter = cli.getFormatter()
  if (fix) {
    completedAction('Fixing Eslint errors')
  } else if (!report.errorCount) {
    completedAction('No Eslint errors found')
  } else {
    // Actually writes the human readable version
    console.log(formatter(report.results))
  }
  if (fix) {
    CLIEngine.outputFixes(report)
  }
  return Promise.resolve(!!report.errorCount)
}

const lintCSS = (fix, settings) => {
  // Allow stylelint to be within the package node_modules folder
  return require(preferThemeNodeModuleFolder('/stylelint', settings))
    .lint({
      fix,
      configBasedir: settings['path.cwd'],
      files: settings['css.stylelintPaths'](settings),
      formatter: 'string'
    })
    .then(function (results) {
      if (!results.errored) {
        completedAction('No stylelint errors found')
      } else {
        // Actually writes the human readable version
        console.log(results.output)
      }
      return Promise.resolve(results.errored)
    })
}
