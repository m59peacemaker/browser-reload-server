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
    root: process.cwd()
  }, options)

  const dir = options.root

  const name = 'dev-server'
  const ID = uuid()
  const wsPath = path.join('/', ID, name)
  const injectJS = makeInjectJS(wsPath)

  const app = express()
  const server = http.createServer(app)
  const wss = WSS({
    server,
    path: wsPath
  })

  function broadcast(msg) {
    wss.clients.forEach(function each(client) {
      client.send(msg)
    })
  }

  const reload = broadcast.bind(null, 'reload')
  const refreshCSS =  broadcast.bind(null, 'refreshCSS')

  function smartReload(filePath) {
    if (filePath) {
      path.extname(filePath).toLowerCase() === '.css' ? refreshCSS() : reload()
    } else {
      reload()
    }
  }

  app.use(serveStatic(dir, {
    index: false
  }))
  app.post('/reload', (req, res) => {
    smartReload(req.filePath)
    res.end()
  })
  app.post('/refreshCSS', (req, res) => {
    refreshCSS()
    res.end()
  })
  app.get('*', (req, res) => {
    if (path.extname(req.url)) {
      res.status(404).end('404 Not Found')
    } else {
      fs.readFile(path.join(dir, 'index.html'), 'utf8', (err, html) => {
        if (err) { return res.status(404).end(err.toString()) }
        const document = jsdom.jsdom(html)
        const script = document.createElement('script')
        script.textContent = injectJS
        document.body.appendChild(script)
        const resp = jsdom.serializeDocument(document)
        res.send(resp)
      })
    }
  })

  Object.assign(server, {
    reload: smartReload,
    refreshCSS,
    wss
  })

  return server
}

function makeInjectJS(wsPath) {
  return `
    (function() {
      var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
      var address = protocol + window.location.host + '${wsPath}'
      var socket = new WebSocket(address)
      socket.onopen = function() {
        console.log('Live reload enabled.')
      }
      socket.onerror = function(err) {
        console.log('Live reload error!')
      }
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
    })()
  `
}
