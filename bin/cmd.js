#!/usr/bin/env node

const program = require('commander')
const Server  = require('../')
const pkg     = require('../package')

program
  .version(pkg.version)
  .option('-d, --dir' , 'directory of files to be served [cwd]')
  .option('-p, --port', '`port` argument for server.listen() [8080]')
  .option('-H, --host', '`host` argument for server.listen()')
  .parse(process.argv)

const server = Server(program)
const listener = server.listen(program.port || 8080, program.host, () => {
  console.log('Listening on port: '+listener.address().port)
})
