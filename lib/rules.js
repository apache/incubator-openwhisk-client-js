'use strict'

const Resources = require('./resources')
const messages = require('./messages')

class Rules extends Resources {
  constructor (namespace, client) {
    super(namespace, client)
    this.resource = 'rules'
    this.identifiers.push('ruleName')
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit'])

    return super.list(options)
  }

  invoke () {
    throw new Error(`Operation (invoke) not supported for rule resource.`)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = this.rule_body(options)

    return super.create(options)
  }

  rule_body (options) {
    options = options || {}

    if (!options.hasOwnProperty('action')) {
      throw new Error(messages.MISSING_RULE_ACTION_ERROR)
    }

    if (!options.hasOwnProperty('trigger')) {
      throw new Error(messages.MISSING_RULE_TRIGGER_ERROR)
    }

    return {action: this.convert_to_fqn(options.action), trigger: this.convert_to_fqn(options.trigger)}
  }

  enable (options) {
    options = options || {}
    options.body = { status: 'active' }
    return super.invoke(options)
  }

  disable (options) {
    options = options || {}
    options.body = { status: 'inactive' }
    return super.invoke(options)
  }

  // TODO: RIP OUT
  convert_to_fqn (identifier) {
    if (identifier.startsWith('/')) {
      return identifier
    }

    return `/_/${identifier}`
  }
}

module.exports = Rules
