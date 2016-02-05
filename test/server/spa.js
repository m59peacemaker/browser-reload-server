const test    = require('tape')
const request = require('request')
const Server  = require('../../')


test('serves files in current directory (no dir opt)', t => {
  t.plan(3)
  var server = Server()
  server.listen(8080, () => {
    request('http://localhost:8080/test/server/www/test.html', (err, resp, body) => {
      server.close(() => {
        t.false(err)
        t.equal(resp.statusCode, 200)
        t.equal(body.trim(), '<p>Test.</p>')
      })
    })
  })
})

test('serves dir given in "dir" opt', t => {
  t.plan(3)
  var server = Server({
    dir: './test/server/www'
  })
  server.listen(8080, () => {
    request('http://localhost:8080/test.html', (err, resp, body) => {
      server.close(() => {
        t.false(err)
        t.equal(resp.statusCode, 200)
        t.equal(body.trim(), '<p>Test.</p>')
      })
    })
  })
})

test('404 for missing files', t => {
  t.plan(2)
  var server = Server({
    dir: './test/server/www'
  })
  server.listen(8080, () => {
    request('http://localhost:8080/does-not-exist.css', (err, resp, body) => {
      server.close(() => {
        t.false(err)
        t.equal(resp.statusCode, 404)
      })
    })
  })
})

test('route all non-file requests to root index.html', t => {
  t.plan(3)
  var server = Server({
    dir: './test/server/www'
  })
  server.listen(8080, () => {
    request('http://localhost:8080/does/not/exist', (err, resp, body) => {
      server.close(() => {
        t.false(err)
        t.equal(resp.statusCode, 200)
        t.true(~body.indexOf('<p>Server test root: www/index.html</p>'))
      })
    })
  })
})
