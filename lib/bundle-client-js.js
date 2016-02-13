const browserify = require('browserify')

const b = browserify(__dirname+'/../node_modules/@m59/reload-client/index.js', {
  standalone: 'devServer.ClientModule'
})
b.bundle()
  .pipe(process.stdout)
