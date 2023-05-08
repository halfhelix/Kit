module.exports = {
  debug: false,
  themes: {
    development: {
      theme: process.env.THEME_ID,
      password: process.env.PASSWORD,
      store: process.env.STORE,
      ignore: ['config/settings_data.json', /templates\/.*[.]json/]
    },
    production: {
      theme: process.env.THEME_ID,
      password: process.env.PASSWORD,
      store: process.env.STORE,
      ignore: ['config/settings_data.json', /templates\/.*[.]json/]
    }
  },
  'git.builtThemeRepositoryUrl': process.env.BUILT_THEME_REPO_URL,
  'git.srcThemeRepositoryUrl': process.env.SRC_THEME_REPO_URL,
  babel: {
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
    sourceMaps: true,
    presets: ['@babel/preset-env']
  },
  $listeners: {
    'upload.queue'(files, utils, settings) {
      utils.outputFile(
        './../../../logs/POST_FILE_FILTER_OUTPUT.json',
        JSON.stringify(files)
      )
    },
    'build.files'(files, utils, settings) {
      utils.outputFile(
        './../../../logs/POST_FILE_FILTER_OUTPUT.json',
        JSON.stringify(files)
      )
    }
  },
  'bs.reloadDelay': 1500
}
