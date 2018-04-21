const sender = require('../sender-wrapper')

test('client sender', async () => {
  const result = await sender.send('eth_sendRawTransaction', {nonce: 9232})
})
