#! /usr/bin/env node
'use strict'

const program = require('commander')
const pkg = require('./package.json')
const webpacker = require('@halfhelix/webpacker')
const configure = require('@halfhelix/configure')
const { developerThemeService } = require('@halfhelix/shopify-kit')
const { scaffoldTheme } = require('@halfhelix/shopify-kit')
const { gitlab, github } = require('@halfhelix/gitlab-kit')
const { splash, epilogue, error } = require('@halfhelix/terminal-kit')
const {
  getPackageInformation,
  getVersionDetails
} = require('./lib/getPackageInformation')

const {
  prepareForDeployment,
  deployFiles,
  buildTheme,
  deployFile,
  chunkStylesheets,
  getThemeInformation
} = require('@halfhelix/shopify-kit')

let command = false
let subCommand = false
let developerThemeWorkflow = false

program
  .version(pkg.version)
  .arguments('<cmd>')
  .usage(
    '[scaffold|watch|build|deploy|lint|gitlab|critical|theme <command>]|sync-back-to-source-repo'
  )
  .option('-e --env [env]', 'specify an environment')
  .option('-u --upload [upload]', 'upload specific file in critical command')
  .option('-q --quick', 'hide the loading screen and any synthetic pauses')
  .option('--debug', 'turn the debug flag on')
  .option(
    '--routine',
    'specify the gitlab routine: merge-request/create or commits/lint'
  )
  .option('--close', 'close critical command after processing once')
  .option('--sync-with-repo', 'sync built theme to remote repo')
  .option('--no-open', 'do not open the default browser')
  .option('--developer', 'use developer theme in watch and deploy commands')
  .option(
    '--compiled-only',
    'only deploy compiled files only in deploy command'
  )
  .option(
    '--include [types]',
    'the mime types to include in lint command (js,css)'
  )
  .option(
    '--open',
    'open the default browser automatically (applies to "watch")'
  )
  .option(
    '--no-open',
    'do not open the default browser automatically (applies to "watch")'
  )
  .action((cmd, args, program) => {
    command = cmd

    if ((program.args || []).length > 1) {
      subCommand = program.args[1]
    }

    // Proxies watch and deploy commands for
    // an intuitive "kit theme" sequence of sub commands
    if (command === 'theme' && ~['watch', 'deploy'].indexOf(subCommand)) {
      command = subCommand
      developerThemeWorkflow = true
    }
  })

program.addHelpCommand(
  'help [command]',
  'list out available commands and options'
)

program.parse(process.argv)

const options = program.opts()

new Promise(async (resolve) => {
  try {
    const details = await getPackageInformation('@halfhelix/kit')
    options.quick
      ? true
      : splash({
          title: 'Half Helix Kit',
          subtitle: 'The developer toolbelt',
          version: getVersionDetails(details, `${pkg.version}`)
        })
    resolve()
  } catch (e) {
    options.quick
      ? true
      : splash({
          title: 'Half Helix Kit',
          subtitle: 'The developer toolbelt'
        })
    resolve()
  }
})
  .then(async () => {
    const commandLineOptions = {
      simple: options['quick'],
      close: options.close,
      quick: options.quick,
      upload: options.upload,
      env: options.env || 'development',
      isDeveloper: options.developer || developerThemeWorkflow,
      compiledOnly: options.compiledOnly,
      task: command
    }

    if (options.debug) {
      commandLineOptions['debug'] = true
    }

    if (typeof options.open !== 'undefined') {
      commandLineOptions['bs.open'] = options.open
    }

    if (~['scaffold'].indexOf(command)) {
      await scaffoldTheme()
      epilogue()
      return
    }

    const settings = await configure(commandLineOptions)

    if (~['deploy', 'watch', 'critical'].indexOf(settings.task)) {
      await getThemeInformation(settings)
      await prepareForDeployment(settings)
    }

    if (~['build', 'deploy'].indexOf(command)) {
      const remoteBranchExists =
        options.syncWithRepo && settings.task === 'build'
          ? await github.prepareDistRepo(settings)
          : undefined

      let files = await webpacker(settings)
      files = settings['css.chunk']
        ? await chunkStylesheets(files, settings)
        : files

      if (!files || !files.length) {
        epilogue({ error: true })
      }

      if (settings.task === 'deploy') {
        await deployFiles(files || [], settings)
        return epilogue({ error: false })
      }

      if (options.syncWithRepo) {
        await buildTheme(files || [], settings)
        await github.commitAndPush(settings, remoteBranchExists)
      } else {
        await buildTheme(files || [], settings)
      }

      return epilogue({ error: false })
    }

    if (~['critical'].indexOf(settings.task)) {
      webpacker.critical(settings, (files) => {
        chunkStylesheets(files, settings).then((files) => {
          deployFiles(files, settings)
        })
      })
      return
    }

    if (~['watch'].indexOf(settings.task)) {
      webpacker.watch(
        settings,
        async (event, file, settings) => await deployFile(event, file, settings)
      )
      return
    }

    if (~['lint'].indexOf(settings.task)) {
      webpacker
        .lint(
          {
            include:
              (options.include
                ? typeof options.include === 'string'
                  ? options.include.split(',')
                  : options.include
                : command.include) || 'css,js',
            fix: options.fix
          },
          settings
        )
        .then(() => {
          epilogue()
        })
      return
    }

    if (~['gitlab', 'sync-back-to-source-repo'].indexOf(command)) {
      const routine =
        command === 'sync-back-to-source-repo'
          ? 'sync-back-to-source-repo'
          : options.routine
      await gitlab(routine, settings)
      epilogue()
      return
    }

    if (~['theme'].indexOf(command)) {
      await developerThemeService(subCommand, options, settings)
      epilogue()
      return
    }
  })
  .catch((e) => {
    error(e)
    epilogue()
    process.exit(1)
  })
