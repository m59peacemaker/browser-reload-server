const browserify = require('browserify')

const b = browserify(__dirname+'/../client/index.js', {
  standalone: 'devServer.ClientModule'
})
b.bundle()
  .pipe(process.stdout)
