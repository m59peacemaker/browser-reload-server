const jsdom = require('jsdom')

module.exports = function(html, js) {
  const document = jsdom.jsdom(html, {
    features: {
      FetchExternalResources: false,
      ProcessExternalResources: false
    }
  })
  const script = document.createElement('script')
  script.textContent = js
  document.body.appendChild(script)
  const resp = jsdom.serializeDocument(document)
  return resp
}
