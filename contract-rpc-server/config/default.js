module.exports = {
  rpc: {
    port: 19508
  },
  logger: {
    appenders: {
      out: {type: 'stdout'}
    },
    categories: {
      default: {appenders: ['out'], level: 'debug'}
    }
  },
  chain: {
    url: 'http://192.168.31.47:6789',
    coinbase: '0xcd1dd2796e5444c1eae14edc1cd0312fffaa1652',
    network: 'privatenet',
    privateKey: 'c438baeb29388c6382541d9363a6920f6b77d8b6625346b3e6e81c3ec762a7d9'
  }
}
