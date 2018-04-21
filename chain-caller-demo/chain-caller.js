const ChainCaller = require('sphinx-contract-rpc-client')
const web3 = new (require('web3'))()

const userId = 'FaGyHDysSI9pe0Y'
const creator = web3.utils.fromUtf8(userId)

ChainCaller('UserWallet', 'getUserBalance', creator).then((result) => {
  console.log('caller result: %o', result)
})

ChainCaller('UserWallet', 'addBalance', creator, 1e3, {from: '0x55e17c66c90630ac584f43685cbe8b81880e039a'}).then(
  (result) => {
    console.log('caller result: %o', result)
  }
)
