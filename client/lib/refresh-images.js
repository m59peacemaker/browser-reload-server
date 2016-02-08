import bustCache from './bust-cache'

function refreshImages() {
  [...document.getElementsByTagName('img')].forEach(elem => elem.src = bustCache(elem.src))
}

export default refreshImages
