import app from './lib/init'
import 'modules/**/*.js'

document.addEventListener('DOMContentLoaded', () => {
  app.init()
  console.log('Hello World')
})
