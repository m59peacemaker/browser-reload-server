const test      = require('tape')
const Server    = require('../../')
const WebSocket = require('ws')

test('server.reload emits "reload" to client', t => {
  t.plan(1)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', data => {
      server.close(() => {
        t.equal(JSON.parse(data).type, 'reload')
      })
    })
    ws.on('open', server.reload)
  })
})

test('server.reload emits "refreshCSS" if passed path to css file', t => {
  t.plan(1)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', data => {
      server.close(() => {
        t.equal(JSON.parse(data).type, 'refreshCSS')
      })
    })
    ws.on('open', () => {
      server.reload('/dude/swag.css')
    })
  })
})

test('server.reload emits "refreshImages" if passed path to image file', t => {
  t.plan(1)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', data => {
      server.close(() => {
        t.equal(JSON.parse(data).type, 'refreshImages')
      })
    })
    ws.on('open', () => {
      server.reload('/dude/swag.png')
    })
  })
})

test('server.refreshCSS emits "refreshCSS" to client', t => {
  t.plan(1)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', data => {
      server.close(() => {
        t.equal(JSON.parse(data).type, 'refreshCSS')
      })
    })
    ws.on('open', server.refreshCSS)
  })
})

test('server.refreshImages emits "refreshImages" to client', t => {
  t.plan(1)
  const server = Server()
  server.listen(8080, () => {
    var ws = new WebSocket('ws://localhost:8080'+server.wsPath)
    ws.on('message', data => {
      server.close(() => {
        t.equal(JSON.parse(data).type, 'refreshImages')
      })
    })
    ws.on('open', server.refreshImages)
  })
})
