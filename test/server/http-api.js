const test    = require('tape')
const request = require('request')
const WebSocket = require('ws')
const Server  = require('../../')

test('POST /reload emits "reload" to client', t => {
  t.plan(2)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', msg => {
      server.close(() => {
        t.equal(msg, 'reload')
      })
    })
    ws.on('open', () => {
      request.post('http://localhost:8080/reload', (err, resp, body) => {
        t.false(err)
      })
    })
  })
})

test('POST /reload emits "refreshCSS" if body.path is to css file', t => {
  t.plan(2)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', msg => {
      server.close(() => {
        t.equal(msg, 'refreshCSS')
      })
    })
    ws.on('open', () => {
      const body = {path: '/path/to/css/file.css'}
      request.post('http://localhost:8080/reload', {json: body}, (err, resp, body) => {
        t.false(err)
      })
    })
  })
})

test('POST /reload emits "refreshCSS" if query.path is to css file', t => {
  t.plan(2)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', msg => {
      server.close(() => {
        t.equal(msg, 'refreshCSS')
      })
    })
    ws.on('open', () => {
      request.post('http://localhost:8080/reload?path=/path/to/css/file.css', (err, resp, body) => {
        t.false(err)
      })
    })
  })
})


test('POST /refreshCSS emits "refreshCSS" to client', t => {
  t.plan(2)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', msg => {
      server.close(() => {
        t.equal(msg, 'refreshCSS')
      })
    })
    ws.on('open', () => {
      request.post('http://localhost:8080/refreshCSS', (err, resp, body) => {
        t.false(err)
      })
    })
  })
})
