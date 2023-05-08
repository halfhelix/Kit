module.exports = {
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
  babel: {
    plugins: [],
    sourceMaps: true,
    presets: ['@babel/preset-env']
  }
}
