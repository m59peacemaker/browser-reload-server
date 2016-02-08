const http        = require('http')
const express     = require('express')
const serveStatic = require('serve-static')
const bodyParser  = require('body-parser')
const path        = require('path')
const fs          = require('fs')
const uuid        = require('uuid-v4')
const WSS         = require('ws').Server
const isImgExt    = require('./lib/is-img-ext')
const addJsToHTML = require('./lib/add-js-to-html')
const clientJS    = fs.readFileSync(__dirname+'/client/dist/client.js', 'utf8')

module.exports = server

function server(options) {

  options = Object.assign({
    dir: process.cwd(),
    wsPath: path.join('/', uuid(), 'dev-server')
  }, options)

  const injectJS = `
    ${clientJS}
    var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
    var url = protocol + window.location.host + '${options.wsPath}'
    devServer.ClientModule.default(url)
  `

  const app = express()
  const server = http.createServer(app)
  const wss = WSS({
    server,
    path: options.wsPath
  })

  function broadcast(msg) {
    wss.clients.forEach(function each(client) {
      client.send(msg)
    })
  }

  const reload = broadcast.bind(null, 'reload')
  const refreshCSS =  broadcast.bind(null, 'refreshCSS')
  const refreshImages =  broadcast.bind(null, 'refreshImages')

  function smartReload(filePath) {
    const ext = path.extname(filePath).toLowerCase().slice(1)
    if (ext === 'css') {
      refreshCSS()
    } else if (isImgExt(ext)) {
      refreshImages()
    } else {
      reload()
    }
  }

  app.use(serveStatic(options.dir, {
    index: false
  }))
  app.use(bodyParser.json())
  app.post('/reload', (req, res) => {
    smartReload(req.body.path || req.query.path)
    res.end()
  })
  app.post('/reload/css', (req, res) => {
    refreshCSS()
    res.end()
  })
  app.post('/reload/img', (req, res) => {
    refreshImages()
    res.end()
  })
  app.get('*', (req, res) => {
    if (path.extname(req.url)) {
      res.status(404).end('404 Not Found')
    } else {
      fs.readFile(path.join(options.dir, 'index.html'), 'utf8', (err, html) => {
        if (err) { return res.status(404).end(err.toString()) }
        const resp = addJsToHTML(html, injectJS)
        res.send(resp)
      })
    }
  })

  const oldClose = server.close
  server.close = function() {
    server.wss.close(() => {
      oldClose.apply(server, arguments)
    })
  }

  Object.assign(server, {
    reload: smartReload,
    refreshCSS,
    refreshImages,
    wsPath: options.wsPath,
    wss
  })

  return server
}
