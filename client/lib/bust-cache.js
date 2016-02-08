import {parse, format} from 'url'
import uuid from 'uuid-v4'

function bustCache(param, url) {
  let parsedUrl = parse(url)
  parsedUrl.query[param] = new Date().valueOf()
  return format(parsedUrl)
}

export default bustCache.bind(uuid())
