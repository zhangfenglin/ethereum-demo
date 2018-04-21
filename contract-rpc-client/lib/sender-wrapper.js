const config = require('config')
const Sender = require('./sender')

const rpcClient = require('jayson').client
const rpc = rpcClient.http(config.get('contractRPC.serverURL'))
const sender = new Sender({
  rpc
})

module.exports = sender
