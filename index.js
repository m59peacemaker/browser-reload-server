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
const execSync    = require('child_process').execSync

const clientJS = execSync(`node ${__dirname}/lib/bundle-client-js`).toString()

module.exports = server

function server(options) {

  options = Object.assign({
    dir: process.cwd(),
    wsPath: path.join('/', uuid(), 'reload-server'),
    quiet: false
  }, options)

  function log() {
    if (options.quiet) { return }
    [].slice.call(arguments).forEach(item => {
      if (typeof item === 'string') {
        item = '[reload-server] '+item
      }
      console.log(item)
    })
  }

  const injectJS = `
    ${clientJS}
    var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
    var url = protocol + window.location.host + '${options.wsPath}'
    devServer.ClientModule.default(url, {quiet: ${options.quiet}})
  `

  const app = express()
  const server = http.createServer(app)
  const wss = WSS({
    server,
    path: options.wsPath
  })

  function broadcast(type, path) {
    log('action: '+type)
    path && log('path: '+path)
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({
        type,
        path
      }))
    })
  }

  const reload = broadcast.bind(null, 'reload')
  const refreshCSS =  broadcast.bind(null, 'refreshCSS')
  const refreshImages =  broadcast.bind(null, 'refreshImages')

  function smartReload(filePath) {
    const ext = path.extname(filePath).toLowerCase().slice(1)
    if (ext === 'css') {
      refreshCSS(filePath)
    } else if (isImgExt(ext)) {
      refreshImages(filePath)
    } else {
      reload(filePath)
    }
  }

  function getFilePathFromReq(req) {
    return req.body.path || req.query.path
  }

  app.use(serveStatic(options.dir, {
    index: false
  }))
  app.use(bodyParser.json())
  app.post('/reload', (req, res) => {
    smartReload(getFilePathFromReq(req))
    res.end()
  })
  app.post('/reload/css', (req, res) => {
    refreshCSS(getFilePathFromReq(req))
    res.end()
  })
  app.post('/reload/img', (req, res) => {
    refreshImages(getFilePathFromReq(req))
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
