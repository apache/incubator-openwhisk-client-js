'use strict'

const names = require('./names')

class BaseOperation {
  constructor (client) {
    this.client = client
  }

  request (params) {
    const namespace = this.namespace(params.options)
    const path = this.resource_path(namespace, params.id)
    this.client.request(params.method, path, params.options)
  }

  resource_path (namespace, id) {
    let path = `namespaces/${namespace}/${this.resource}`

    if (id) {
      path = `${path}/${id}`
    }

    return path
  }

  namespace (options) {
    if (options && typeof options.namespace === 'string') {
      return encodeURIComponent(options.namespace)
    }

    return encodeURIComponent(names.default_namespace())
  }

  qs (options, names) {
    options = options || {}
    return names.filter(name => options.hasOwnProperty(name))
      .reduce((previous, name) => {
        previous[name] = options[name]
        return previous
      }, {})
  }
}

module.exports = BaseOperation
