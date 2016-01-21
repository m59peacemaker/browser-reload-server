# Dust Server

Simple SPA development server with reload API. Injects reload script.

## Install

```sh
npm install dust-server
```

## Usage

```javascript
const Server = require('dust-server')
const path   = require('path')

const server = Server({
  root: './www'
})
server.listen(8080)

watch(someFiles, function(event) {
  path.extname(event.path).toLowerCase() === '.css' ? server.refreshCSS() : server.reload()
})
```

## API

### Server(options)
- `options: object`
  - `root: string` path (from cwd) to static directory to be served
- **returns**: `server`

### [listen()](https://nodejs.org/api/http.html#http_server_listen_handle_callback)

### server.reload()
Signals connected clients to reload the page.

### server.refreshCSS()
Signals connected clients to reload CSS without page reload.
