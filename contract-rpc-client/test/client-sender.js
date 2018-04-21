const sender = require('../sender-wrapper')
const run = async () => {
  const result = await sender.send(
    'web3handler.eth_sendRawTransaction',
    'SphinxProxy',
    'addBalance',
    9232,
    'zhangfenglin',
    'sdfkjahsd',
    'sdjfkahds',
    13,
    864
  )
  console.log(result)
}

run()

// {
//   nonce: 9232,
//   name: 'zhangfenglin',
//   address: 'sdfkjahsd'
// }
