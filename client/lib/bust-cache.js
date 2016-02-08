import {parse, format} from 'url'
import uuid from 'uuid-v4'

function bustCache(param, url) {
  let parsedUrl = parse(url, true)
  parsedUrl.search = null // so that `query` will be used instead
  parsedUrl.query = parsedUrl.query || {}
  parsedUrl.query[param] = new Date().valueOf()
  const result = format(parsedUrl)
  return result
}

export default bustCache.bind(null, uuid())
