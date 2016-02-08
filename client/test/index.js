import test from 'tape'
import {WebSocket, Server} from 'mock-socket'
import Client from '../'

test('refreshCSS adds cache buster to stylesheet url', t => {
  t.plan(2)
  const wsUrl = 'ws://localhost:8080'
  window.WebSocket = WebSocket
  const mockServer = new Server(wsUrl)
  mockServer.on('connection', server => {
    mockServer.send({
      type: 'refreshCSS'
    })
    mockServer.send({
      type: 'refreshCSS'
    })
  })
  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/foo.css'
  document.head.appendChild(link)
  const client = Client(wsUrl)
  let oldVal = link.href
  let count = 0
  client.socket.addEventListener('message', event => {
    if (event.data.type, 'refreshCSS') {
      if (count) {
        mockServer.close()
        link.parentNode.removeChild(link)
      }
      t.notEqual(link.href, oldVal, link.href)
      oldVal = link.href
      ++count
    }
  })
})

test('refreshImages adds cache buster to img src', t => {
  t.plan(2)
  const wsUrl = 'ws://localhost:8080'
  window.WebSocket = WebSocket
  const mockServer = new Server(wsUrl)
  mockServer.on('connection', server => {
    mockServer.send({
      type: 'refreshImages'
    })
    mockServer.send({
      type: 'refreshImages'
    })
  })
  let img = document.createElement('img')
  img.src = '/foo.jpg'
  document.head.appendChild(img)
  const client = Client(wsUrl)
  let oldVal = img.src
  let count = 0
  client.socket.addEventListener('message', event => {
    if (event.data.type, 'refreshImages') {
      if (count) {
        mockServer.close()
        img.parentNode.removeChild(img)
      }
      t.notEqual(img.src, oldVal, img.src)
      oldVal = img.src
      ++count
    }
  })
})
