const browserify = require('browserify')

const b = browserify(require.resolve('@m59/reload-client'), {
  standalone: 'devServer.ClientModule'
})
b.bundle()
  .pipe(process.stdout)
