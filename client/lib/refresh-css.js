import bustCache from './bust-cache'

function refreshCSS() {
  [...document.getElementsByTagName('link')].forEach(function(elem) {
    if (!elem.rel || elem.rel.toLowerCase() === 'stylesheet') {
      elem.href = bustCache(elem.href)
    }
  })
}

export default refreshCSS
