import refreshCSS from './lib/refresh-css'
import refreshImages from './lib/refresh-images'

const helpers = {
  refreshCSS,
  refreshImages
}

const actions = {
  reload: window.location.reload,
  refreshCSS,
  refreshImages
}

function Client(wsUrl) {
  var socket = new WebSocket(wsUrl)
  socket.onopen = function() {
    console.log('Live reload enabled.')
  }
  socket.onerror = function(err) {
    console.log('Live reload error!')
  }
  socket.onmessage = function(event) {
    const action = actions[event.data.type]
    action && action()
  }
  return {
    socket,
    ...helpers
  }
}

Object.assign(Client, helpers)
export default Client
