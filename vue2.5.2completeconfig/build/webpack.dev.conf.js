'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')  //可以识别某些类别的Webpack错误并进行清理，聚合和优先排序
const portfinder = require('portfinder')      //查询端口，若重复则重新生成

const HOST = process.env.HOST         //开发环境host
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {       // 将我们 webpack.dev.conf.js 的配置和 webpack.base.conf.js 的配置合并
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })  //同生产
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,        //关于source  map

  // these devServer options should be customized in /config/index.js
  devServer: {       //热更node环境启动服务器
    clientLogLevel: 'warning',     //服务器警告级别
    historyApiFallback: {        //缓存的历史处理方式
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,   //是否开启热更
    contentBase: false, // since we use CopyWebpackPlugin.  同英文
    compress: true,      //压缩
    host: HOST || config.dev.host,       //url配置
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,    //路径
    proxy: config.dev.proxyTable,       //代理
    quiet: true, // necessary for FriendlyErrorsPlugin    使用条件
    watchOptions: {    //监听
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({    //每次更新开发代码
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),            //在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    new webpack.NamedModulesPlugin(), // HMR 显示在控制台上更新的正确文件名。    
    new webpack.NoEmitOnErrorsPlugin(),     //捕获到日志错误时，返回false，即不输出错误日志
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({    //同生产
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([       //同生产
      { 
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {      //查询端口，若重复则重新生成
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
