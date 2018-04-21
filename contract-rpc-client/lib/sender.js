/**
 * RpcCaller
 */
class Sender {
  constructor(opts = {}) {
    this.rpc = opts.rpc
  }

  /**
   * @static method
   * @param {any} args
   * @returns  {Promise}
   * @memberof RPCClient
   */
  static async request(...args) {
    const [rpcCli, method, arg] = args

    if (!rpcCli || !method) {
      return Promise.reject(new Error('request function args error'))
    }
    const tmpArg = args.length < 3 ? {} : arg

    return new Promise((resolve, reject) => {
      rpcCli.request(method, tmpArg, (error, res) => (error ? reject(error) : resolve(res)))
    })
  }

  /**
   * @param {String} method
   * @param {Object} arg
   * @returns {Promise}
   */
  async send(method, ...args) {
    return Sender.request(this.rpc, method, args)
  }
}

module.exports = Sender
