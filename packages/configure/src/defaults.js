module.exports = {
  ...require('./defaults/path'),
  ...require('./defaults/git'),
  ...require('./defaults/themeName'),
  ...require('./defaults/css'),
  ...require('./defaults/debug'),
  ...require('./defaults/browserSync'),
  ...require('./defaults/javascript'),
  ...require('./defaults/shopify'),
  theme: '',
  password: '',
  store: '',
  domain: false,
  ignore: ['config/settings_data.json'],
  webpack: {},
  isCI() {
    return !!process.env.CI_JOB_NAME || !!process.env.GITHUB_ACTIONS
  },
  watch: (settings) => {
    return `${settings['path.src']}/**/*`
  }
}
