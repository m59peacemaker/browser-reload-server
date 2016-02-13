# Reload Server

Simple SPA development server with reload API. Injects reload script.

## Install

```sh
npm install @m59/reload-server
```

## CLI

```sh
m59-reload-server [options]
```

```txt
  -h, --help          output usage information
  -V, --version       output the version number
  -d, --dir  [value]  directory of files to be served [cwd]
  -p, --port [value]  `port` argument for server.listen() [8080]
  -H, --host [value]  `host` argument for server.listen()
  -q, --quiet         disable logging
  --wsPath   [value]  path to the websocket server
```

## JS API

```javascript
const Server = require('@m59/reload-server')

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
  - `quiet: boolean, false`
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

```
POST /reload
POST /reload/css
POST /reload/img
```

The `path` parameter of `server.reload` can be passed as JSON in the body or as a query parameter.

`{"path": "/path/here.css"}`

`/reload?path=/path/here.css`


```sh
curl -X POST http://localhost:8080/reload
```
