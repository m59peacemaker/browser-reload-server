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
  --help, -h
  --dir,  -d   directory of files to be served [cwd]
  --port, -p   `port` argument for server.listen() [8080]
  --host, -H   `host` argument for server.listen()
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
- **returns**: `server`

### [server.listen()](https://nodejs.org/api/http.html#http_server_listen_handle_callback)
See nodejs docs.

### server.reload(path)
Signals connected clients to reload the page. If `path` is given and has an extension of `.css`, CSS will be refreshed instead of page reload.

### server.refreshCSS()
Signals connected clients to reload CSS without page reload.

## HTTP API

```sh
curl -x POST http://localhost:8080/reload
curl -x POST http://localhost:8080/refreshCSS
```

The `path` parameter of `server.reload` can be passed as JSON in the body or as a query parameter.

`{"path": "/path/here.css"}`

`path=/path/here.css`

