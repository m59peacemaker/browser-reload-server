module.exports = isImgExt

function isImgExt(ext) {
  return !!~[
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp'
  ].indexOf(ext.toLowerCase())
}

