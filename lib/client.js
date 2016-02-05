function client(wsPath) {
  var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
  var address = protocol + window.location.host + wsPath
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
}
