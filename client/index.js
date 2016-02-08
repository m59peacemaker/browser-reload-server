import refreshCSS from './lib/refresh-css'
import refreshImages from './lib/refresh-images'

const helpers = {
  refreshCSS,
  refreshImages
}

const actions = {
  reload: window.location.reload.bind(window.location),
  refreshCSS,
  refreshImages
}

function Client(wsUrl) {
  var socket = new WebSocket(wsUrl)
  socket.addEventListener('open', () => {
    console.log('Live reload enabled.')
  })
  socket.addEventListener('error', err => {
    console.log('Live reload error!')
  })
  socket.addEventListener('message', event => {
    const action = actions[event.data.type]
    action && action()
  })
  return {
    socket,
    ...helpers
  }
}

Object.assign(Client, helpers)
export default Client
