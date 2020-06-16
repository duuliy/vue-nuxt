'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')  //通过webpack-merge实现webpack.dev.conf.js对wepack.base.config.js的继承
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
  devtool: config.dev.devtool,        //关于source  map 增强调试

  // these devServer options should be customized in /config/index.js
  devServer: {       //热更node环境启动服务器
    clientLogLevel: 'warning',     //服务器警告级别
    historyApiFallback: {        //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,   //是否开启热更
    contentBase: false, // since we use CopyWebpackPlugin.  同英文
    compress: true,      //压缩
    host: HOST || config.dev.host,       //url配置
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,  //调试时自动打开浏览器
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,    //路径
    proxy: config.dev.proxyTable,       //代理
    quiet: true, // necessary for FriendlyErrorsPlugin    //控制台是否禁止打印警告和错误,若用FriendlyErrorsPlugin 此处为 true
    watchOptions: {    //监听文件系统检测改动
      poll: config.dev.poll, //多长时间检查一次
    }
  },
  plugins: [
    new webpack.DefinePlugin({    //每次更新开发代码
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),            //模块热替换插件，修改模块时不需要刷新页面
    new webpack.NamedModulesPlugin(), // HMR 显示在控制台上更新的正确文件名。    
    new webpack.NoEmitOnErrorsPlugin(),     //当webpack编译错误的时候，来中端打包进程，防止错误代码打包到文件中
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({    //同生产
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([       //同生产 复制插件
      { 
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*'] //忽略.*的文件
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {      //查询端口，若重复则重新生成
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {  //查找端口号
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
