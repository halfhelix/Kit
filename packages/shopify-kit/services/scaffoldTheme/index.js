const path = require('path')
const fs = require('fs-extra')
const wait = require('w2t')
const output = require('@halfhelix/terminal-kit')

/**
 * Copies over a bootstrap of a Kit-supporting Shopify theme
 *
 * @param {Array} originalFiles
 * @param {Object} settings
 */
module.exports = async function () {
  const spinner = output.action(`Creating theme files in current folder...`)
  await fs.copy(path.normalize(`${__dirname}/scaffold`), process.cwd())
  await wait(500)
  spinner.succeed()
}
