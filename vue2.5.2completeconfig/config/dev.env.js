'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {                      //开发配置
  NODE_ENV: '"development"'
})
