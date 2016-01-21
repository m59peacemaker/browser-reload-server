const http        = require('http')
const express     = require('express')
const serveStatic = require('serve-static')
const path        = require('path')
const fs          = require('fs')
const uuid        = require('uuid-v4')
const WSS         = require('ws').Server
const jsdom       = require('jsdom')

module.exports = server

function server(options) {
  options = Object.assign({

  }, options)

  const dir = path.join(process.cwd(), options.root ? '/'+options.root : '')

  const name = 'dev-server'
  const ID = uuid()
  const wsPath = path.join('/', ID, name)
  const injectJS = makeInjectJS(wsPath)

  const app = express()
  const server = http.createServer(app)
  const wss = WSS({
    server: server,
    path: wsPath
  });
  function broadcast(msg) {
    wss.clients.forEach(function each(client) {
      client.send(msg);
    });
  }

  app.use(serveStatic(dir, {
    index: false
  }))
  app.get('*', (req, res) => {
    if (path.extname(req.url)) {
      res.status(404).end('404 Not Found')
    } else {
      fs.readFile(path.join(dir, 'index.html'), 'utf8', (err, html) => {
        jsdom.env(html, (err, window) => {
          const script = window.document.createElement('script')
          script.textContent = injectJS
          window.document.body.appendChild(script)
          res.send(jsdom.serializeDocument(window.document))
        })
      })
    }
  })
  return {
    listen: server.listen.bind(server),
    reload: broadcast.bind(null, 'reload'),
    refreshCSS: broadcast.bind(null, 'refreshCSS')
  }
}

function makeInjectJS(wsPath) {
  return `
    (function() {
      var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
      var address = protocol + window.location.host + '${wsPath}'
      var socket = new WebSocket(address)
      socket.onmessage = function(msg) {
        if (msg.data === 'reload') {
          window.location.reload()
        } else if (msg.data === 'refreshCSS') {
          [].slice.call(document.getElementsByTagName('link')).forEach(function(elem) {
            if (!elem.rel || elem.rel.toLowerCase() === 'stylesheet') {
              var param = 'cache-bust'
              href = elem.href.replace(new RegExp('('+param+'=)[^\&]+'), '')
              elem.href = href+(~href.indexOf('?') ? '&' : '?')+param+'='+(new Date().valueOf())
            }
          })
        }
      }
      console.log('Live reload enabled.')
    })()
  `
}
