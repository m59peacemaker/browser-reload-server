import refreshCSS from './lib/refresh-css'
import refreshImages from './lib/refresh-images'

function Log(quiet) {
  return (...items) => {
    if (quiet) { return }
    items.forEach(item => {
      if (typeof item === 'string') {
        item = '[reload-client] '+item
      }
      console.log(item)
    })
  }
}

const helpers = {
  refreshCSS,
  refreshImages
}

const actions = {
  reload: window.location.reload.bind(window.location),
  refreshCSS,
  refreshImages
}

function Client(wsUrl, options = {}) {
  const log = Log(options.quiet)
  const socket = new WebSocket(wsUrl)
  socket.addEventListener('open', () => {
    log('Live reload enabled.')
  })
  socket.addEventListener('error', err => {
    log('Live reload error!')
  })
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    const action = actions[data.type]
    log('signal: '+data.type)
    data.path && log('path: '+data.path)
    action && action()
  })
  return {
    socket,
    ...helpers
  }
}

Object.assign(Client, helpers)
export default Client
