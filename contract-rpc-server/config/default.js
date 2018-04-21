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
  }
}
