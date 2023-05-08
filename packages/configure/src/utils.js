const util = require('util')
const exec = require('child_process').exec
const fs = require('fs-extra')
const promiseExec = util.promisify(require('child_process').exec)

const reverseSlashes = (path) => {
  return path.replace(/\\/g, '/')
}

const getCommit = () => {
  return new Promise((resolve) => {
    exec('git rev-parse HEAD | cut -c1-7', (err, stdout, stderr) => {
      resolve(stdout.trim())
    })
  })
}

const getDate = () => {
  return new Promise((resolve) => {
    exec("date +'%m.%d.%y'", (err, stdout, stderr) => {
      resolve(stdout.trim())
    })
  })
}

const getBranch = () => {
  return new Promise((resolve) => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      resolve(stdout.trim())
    })
  })
}

const getUsername = () => {
  return new Promise((resolve) => {
    exec('git config user.name', (err, stdout, stderr) => {
      resolve(stdout.trim())
    })
  })
}

const getNPMPrefix = () => {
  return new Promise((resolve) => {
    exec('npm config get prefix', (err, stdout, stderr) => {
      resolve(stdout.trim())
    })
  })
}

const pathExists = (fileOrDir) => {
  return fs.pathExistsSync(fileOrDir)
}

const movePath = (from, to) => {
  return fs.moveSync(from, to)
}

const copyPath = (from, to) => {
  return fs.copySync(from, to)
}

const outputFile = (file, data = '') => {
  return fs.outputFileSync(file, data)
}

const appendToFile = (file, data = '') => {
  return fs.appendFileSync(file, '\n' + data)
}

const emptyDir = (path) => {
  return fs.emptyDirSync(path)
}

const readJson = (path) => {
  return fs.readJsonSync(path)
}

const writeJson = (path, data) => {
  fs.outputJSONSync(path, data, { spaces: 2 })
}

const readThemeLogFile = (settings) => {
  return pathExists(
    `${settings['path.cwd']}/${settings['shopify.themeLogFile']}`
  )
    ? readJson(`${settings['path.cwd']}/${settings['shopify.themeLogFile']}`)
    : {}
}

module.exports = {
  exec: promiseExec,
  reverseSlashes,
  getCommit,
  getDate,
  getBranch,
  getUsername,
  getNPMPrefix,
  pathExists,
  movePath,
  copyPath,
  outputFile,
  appendToFile,
  emptyDir,
  readJson,
  writeJson,
  readThemeLogFile
}
