const jsdom = require('jsdom')

module.exports = function(html, js) {
  const document = jsdom.jsdom(html)
  const script = document.createElement('script')
  script.textContent = js
  document.body.appendChild(script)
  const resp = jsdom.serializeDocument(document)
  return resp
}
