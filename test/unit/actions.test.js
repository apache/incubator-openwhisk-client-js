// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Actions = require('../../lib/actions')

test('should list all actions without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions`)
    t.deepEqual(options, {qs: {}})
  }

  return actions.list()
})

test('should list all actions with parameters', t => {
  t.plan(3)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/actions`)
    t.deepEqual(options.qs, {skip: 100, limit: 100})
  }

  return actions.list({namespace: 'custom', skip: 100, limit: 100})
})

test('should list all actions with parameter count', t => {
  t.plan(3)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/actions`)
    t.deepEqual(options.qs, {count: true})
  }

  return actions.list({namespace: 'custom', count: true})
})

test('should retrieve action from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get({name: '12345'})
})

test('should retrieve action from identifier with code query parameter', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const code = {
    code: false
  }

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, code)
  }

  return actions.get({name: '12345', code: false})
})

test('should retrieve action from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get('12345')
})

test('should delete action from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.delete({name: '12345'})
})

test('should retrieve actionName from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get({actionName: '12345'})
})

test('should delete action from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.delete('12345')
})

test('should invoke action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({name: '12345'})
})

test('should invoke action from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.invoke('12345')
})

test('should invoke fully qualified action', t => {
  t.plan(4)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({name: '/custom/12345'})
})

test('should invoke fully qualified action with package', t => {
  t.plan(4)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/actions/package/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({name: '/custom/package/12345'})
})

test('should invoke blocking action with body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {foo: 'bar'})
  }

  return actions.invoke({name: '12345', blocking: true, params: {foo: 'bar'}})
})

test('should invoke action to retrieve result', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const result = {hello: 'world'}

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {blocking: true})
    return Promise.resolve({response: {result}})
  }

  return actions.invoke({name: '12345', result: true, blocking: true}).then(_result => {
    t.deepEqual(_result, result)
  })
})

test('should invoke action to retrieve result without blocking', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const result = {hello: 'world'}

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    return Promise.resolve({response: {result}})
  }

  return actions.invoke({name: '12345', result: true}).then(_result => {
    t.deepEqual(_result, {response: {result}})
  })
})

test('should invoke blocking action using actionName', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({actionName: '12345'})
})

test('create a new action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action}})
  }

  return actions.create({name: '12345', action})
})

test('create a new action with custom kind', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const kind = 'custom_runtime:version'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind, code: action}})
  }

  return actions.create({name: '12345', action, kind})
})

test('create a new action with custom body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const code = 'function main() { // main function body};'
  const action = {exec: {kind: 'swift', code: code}}
  const kind = 'custom_runtime:version'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, action)
  }

  return actions.create({name: '12345', kind, action})
})

test('create a new action with buffer body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = Buffer.from('some action source contents')
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action.toString('base64')}})
  }

  return actions.create({name: '12345', action})
})

test('create a new action with default parameters', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const params = {
    foo: 'bar'
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {
      exec: {kind: 'nodejs:default', code: action},
      parameters: [
        {key: 'foo', value: 'bar'}
      ]
    })
  }

  return actions.create({name: '12345', action, params})
})

test('create a new action with annotations', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const annotations = {
    foo: 'bar'
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action},
      annotations: [
        { key: 'foo', value: 'bar' }
      ]})
  }

  return actions.create({name: '12345', action, annotations})
})

test('create a new action with limits', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const limits = {
    timeout: 300000
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action}, limits: {timeout: 300000}})
  }

  return actions.create({name: '12345', action, limits})
})

test('create an action without providing an action body', t => {
  const actions = new Actions()
  t.throws(() => actions.create({name: '12345'}), /Missing mandatory action/)
})

test('create a new action with version parameter', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action}, version: '1.0.0'})
  }

  return actions.create({name: '12345', action, version})
})
