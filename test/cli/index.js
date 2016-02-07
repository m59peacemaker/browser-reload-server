const test = require('tape')
const spawn = require('child_process').spawn
const WebSocket = require('ws')
const request = require('request')

const delay = 800

test('cmd starts the server', t => {
  t.plan(1)
  const server = spawn('./bin/cmd.js', ['--wsPath', '/'])
  server.stderr.on('data', () => {
    server.on('close', t.fail)
    server.kill(t.fail)
  })
  setTimeout(() => {
    var ws = new WebSocket('ws://localhost:8080')
    ws.on('error', (err) => {
      server.on('close', () => t.fail(err))
      server.kill()
    })
    ws.on('open', () => {
      server.on('close', t.pass)
      server.kill()
    })
  }, delay)
})

test('cmd uses `port` arg', t => {
  t.plan(1)
  const server = spawn('./bin/cmd.js', ['--wsPath', '/', '-p', 8081])
  server.stderr.on('data', () => {
    server.on('close', t.fail)
    server.kill()
  })
  setTimeout(() => {
    var ws = new WebSocket('ws://localhost:8081')
    ws.on('error', (err) => {
      server.on('close', () => t.fail(err))
      server.kill()
    })
    ws.on('open', () => {
      server.on('close', t.pass)
      server.kill()
    })
  }, delay)
})

test('cmd uses `dir` arg', t => {
  t.plan(2)
  const server = spawn('./bin/cmd.js', ['--wsPath', '/', '-d', './test/cli/www'])
  server.stderr.on('data', () => {
    server.on('close', t.fail)
    server.kill()
  })
  setTimeout(() => {
    request.get('http://localhost:8080', (err, resp, body) => {
      server.on('close', () => {
        t.false(err)
        t.true(~body.indexOf('<p>CLI TEST</p>'))
      })
      server.kill()
    })
  }, delay)
})
