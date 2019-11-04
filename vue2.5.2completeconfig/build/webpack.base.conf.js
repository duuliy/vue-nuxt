'use strict'
const path = require('path')    // 使用 NodeJS 自带的文件路径插件
const utils = require('./utils')      //封装了一些方法的工具
const config = require('../config')     //使用 config/index.js
const vueLoaderConfig = require('./vue-loader.conf')   //使用loader

 // 拼接我们的工作区路径为一个绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {   // 编译文件入口
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,  //使用chonfig/index.js中build的assetsRoot作为输出根路径
    filename: '[name].js',     //编译输入的文件名
    publicPath: process.env.NODE_ENV === 'production'    //正式发布环境下编译输出的发布路径
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],     // 自动补全的扩展名,能够使用户在引入模块时不带扩展
    alias: {                // 默认路径代理，例如 import Vue from 'vue$'，会自动到 'vue/dist/vue.esm.js'中寻找
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),      //@代替src路径
    }
  },
  module: {
    rules: [               //模块的规则数组,详情请参考上述链接的loader列表
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,  // 文件的大小小于10000字节(10kb)的时候会返回一个base64
          name: utils.assetsPath('img/[name].[hash:7].[ext]')  // 生成的文件的保存路径和后缀名称
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',     
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {    //以下选项是Node.js全局变量或模块，这里主要是防止webpack注入一些Node.js的东西到vue中
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',   //fs模块不用说吧
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'    //子程序
  }
}
