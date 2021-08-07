const chalk = require('chalk')
const cliProgress = require('cli-progress')

const { log } = require('./utils')
const { clear, icon, newLines } = require('./atoms')
const {
  logo,
  box,
  truncatingBox,
  title,
  subtitle,
  spinner
} = require('./molecules')

function splash({ title: bar, subtitle: foo, version = {} }) {
  clear()
  logo()
  box(
    title(`${icon('pointerSmall')} ${bar}`),
    subtitle(`${icon('pointerSmall')} ${foo}`),
    version && version.message
      ? subtitle(
          `${icon('pointerSmall')} ${chalk[
            version.isCurrent ? 'green' : 'blue'
          ](version.message)}`
        )
      : null
  )
}

function action(string) {
  return spinner(string)
}

function completedAction(string) {
  return log(`${chalk.green(icon('tick'))} ${string}`)
}

function warning(string, newLine = false) {
  log(`${chalk.green(icon('warning'))} ${string}`)
  newLine && log(newLines())
}

function webpackResponse(stats, settings) {
  const asJson = stats.toJson()
  const strings = (asJson.assets || []).map((obj) => {
    return `${icon('star')} ${obj['name']} [${obj['size'] / 1000} kbs]`
  })
  box(title('Assets: '), ...strings)
  ;(asJson.errors || []).length && log((asJson.errors || []).join('\n') + '\n')
}

function genericListBox(header = '', list = [], settings) {
  const strings = list.map((element) => {
    return `${icon('star')} ${element}`
  })
  box(title(header), ...strings)
}

function epilogue({
  error = false,
  title: foo = false,
  subtitle: bar = false
} = {}) {
  const text = foo
    ? foo
    : error
    ? 'Process completed with errors'
    : 'Process completed!'

  box(
    title(error ? chalk.red(text) : text),
    subtitle(
      bar ||
        (error
          ? `${icon('arrowUp')} Check the output above`
          : `Learn more about us at ${chalk.underline(
              'https://halfhelix.com'
            )}`)
    )
  )
}

function browserSyncNotice({ target, proxy }) {
  box(
    title('BrowserSync proxy ready for use'),
    subtitle(`Target: ${chalk.underline(target)}`),
    subtitle(`Proxy: ${chalk.underline(proxy)}`),
    subtitle(`\n${icon('arrowUp')} ${icon('arrowDown')} Listening for changes`)
  )
}

function error(e, renderToString = true, shouldExit = false) {
  box(
    e.message ? title('Error:') : title(`Oh dang it!`),
    e.message || 'An error occurred'
  )

  renderToString && log(e.toString())
  shouldExit && process.exit(1)
}

function uploadErrors(list, title = 'Errors:') {
  truncatingBox(title, ...list.map((item) => `${icon('star')} ${item}`))
}

function progressBar(title, total, explode = false) {
  let bar

  if (explode) {
    completedAction(`Start Progress: ${title}`)
  } else {
    bar = new cliProgress.SingleBar(
      {
        barsize: 25,
        format: `${title} {bar} {percentage}% | Errors: {errors} | ETA: {eta}s | {value}/{total}`
      },
      cliProgress.Presets.shades_classic
    )
    bar.start(total, 0, {
      errors: 0
    })
  }

  return function (current, otherMetrics, fileToken) {
    if (explode) {
      completedAction(
        `[${current} of ${total}, Errors: ${otherMetrics.errors}] ${fileToken.theme}`
      )
    } else {
      bar.update(current, otherMetrics)
      if (current >= total) {
        bar.stop()
      }
    }
  }
}

module.exports = {
  splash,
  action,
  completedAction,
  warning,
  webpackResponse,
  genericListBox,
  epilogue,
  browserSyncNotice,
  uploadErrors,
  progressBar,
  error
}
