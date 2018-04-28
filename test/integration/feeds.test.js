// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Feeds = require('../../lib/feeds.js')
const Triggers = require('../../lib/triggers.js')
const Client = require('../../lib/client.js')
const Utils = require('./utils.js')
const options = Utils.autoOptions()

const envParams = ['API_KEY', 'API_HOST', 'NAMESPACE']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}`
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

const NAMESPACE = process.env.__OW_NAMESPACE
const tempTest = Utils.getInsecureFlag() ? test.skip : test

tempTest('create, get, update, and delete a feed', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const feeds = new Feeds(new Client(options))
  const triggers = new Triggers(new Client(options))
  const feedParams = {
    feedName: '/whisk.system/alarms/alarm',
    trigger: `/${NAMESPACE}/sample_feed_trigger`,
    params: {cron: '*/8 * * * * *', trigger_payload: {name: 'test', place: 'hello'}}
  }
  return triggers.create({triggerName: 'sample_feed_trigger'}).then(() => feeds.create(feedParams)).then(result => {
    t.is(result.response.success, true)
    return feeds.get(feedParams).then(getTesult => {
      t.is(getTesult.response.success, true)
      return feeds.delete(feedParams).then(feedResult => {
        t.is(feedResult.response.success, true)
        return feeds.update(feedParams).then(() => {
          t.is(feedResult.response.success, false) // alarms does not currently support update, hence should fail
          return triggers.delete({triggerName: 'sample_feed_trigger'}).then(() => {
            t.pass()
          })
        }).catch(errors)
      }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})
