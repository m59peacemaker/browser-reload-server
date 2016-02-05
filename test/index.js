require('./server')

/*
const test   = require('tape')
const open   = require('opn')
const enableDestroy = require('server-destroy')
const oServer = require('../')

function Server() {
  var server = oServer.apply(null, arguments)
  enableDestroy(server)
  return server
}

test('things', t => {
  t.plan(1)
  const server = Server({
    root: __dirname
  })
  server.wss.on('connection', () => {
    console.log(server.destroy)
    server.destroy(() => {
      t.pass()
    })
  })
  server.listen(8080, () => {
    open('http://localhost:8080', {app: 'firefox'})
  })
})
*/
