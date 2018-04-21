/**
 * modules dependencies
 */

const log4js = require('log4js')
const config = require('config')

module.exports = function createLogger(scope) {
  log4js.configure(config.get('logger'))
  const tmpScope = scope || 'default'

  return log4js.getLogger(tmpScope)
}
