const test      = require('tape')
const Server    = require('../../')

test('serves files in current directory (no dir opt)', t => {
  t.plan(1)
  t.fail()
})

test('serves dir given in "dir" opt', t => {
  t.plan(1)
  t.fail()
})

test('404 for missing files', t => {
  t.plan(1)
  t.fail()
})

test('route all non-file requests to root index.html', t => {
  t.plan(1)
  t.fail()
})
