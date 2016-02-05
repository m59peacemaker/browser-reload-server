const test      = require('tape')
const Server    = require('../../')
const WebSocket = require('ws')

const port = 8080
function listenWs(server, cb) {
  server.listen(port, () => {
    var ws = new WebSocket('ws://localhost:'+port+server.wsPath)
    cb(ws)
  })
}

test('server.reload emits "reload" to client', t => {
  t.plan(1)
  const server = Server()
  listenWs(server, ws => {
    ws.on('message', msg => {
      server.close(() => {
        msg === 'reload' ? t.pass() : t.fail()
      })
    })
    ws.on('open', server.reload)
  })
})

test('server.refreshCSS emits "refreshCSS" to client', t => {
  t.plan(1)
  const server = Server()
  listenWs(server, ws => {
    ws.on('message', msg => {
      server.close(() => {
        msg === 'refreshCSS' ? t.pass() : t.fail()
      })
    })
    ws.on('open', server.refreshCSS)
  })
})

test('server.reload emits "refreshCSS" if passed path to css file', t => {
  t.plan(1)
  const server = Server()
  listenWs(server, ws => {
    ws.on('message', msg => {
      server.close(() => {
        msg === 'refreshCSS' ? t.pass() : t.fail()
      })
    })
    ws.on('open', () => {
      server.reload('/dude/swag.css')
    })
  })
})
