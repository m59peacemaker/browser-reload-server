# Dust Server

Simple SPA development server with reload API. Injects reload script.

## Install

```sh
npm install dust-server
```

## CLI

```sh
dust-server [options]
```

```txt
  -h, --help          output usage information
  -V, --version       output the version number
  -d, --dir  [value]  directory of files to be served [cwd]
  -p, --port [value]  `port` argument for server.listen() [8080]
  -H, --host [value]  `host` argument for server.listen()
  --wsPath   [value]  path to the websocket server
```

## JS API

```javascript
const Server = require('dust-server')

const server = Server({
  dir: './www'
})
server.listen(8080)

watch(someFiles, function(event) {
  server.reload(event.path) // smart reload based on path
})
```

### Server(options)
- `options: object`
  - `dir: string, cwd`
  - `wsPath: string, random`
- **returns**: [server](https://nodejs.org/api/http.html#http_class_http_server)

### server.reload(path)
Signals connected clients to reload the page. If `path` is given, clients may be signaled to refresh CSS or images based on the file extension in the path, rather than reloading the page.

### server.refreshCSS()
Signals connected clients to refresh CSS without page reload.

### server.refreshImages()
Signals connected clients to refresh images without page reload.

### server.wsPath
The path to the websocket server.

### server.wss
The [ws](https://www.npmjs.com/package/ws) server.

## HTTP API

```sh
curl -x POST http://localhost:8080/reload
curl -x POST http://localhost:8080/reload/css
curl -x POST http://localhost:8080/reload/img
```

The `path` parameter of `server.reload` can be passed as JSON in the body or as a query parameter.

`{"path": "/path/here.css"}`

`/live-reload?path=/path/here.css`
