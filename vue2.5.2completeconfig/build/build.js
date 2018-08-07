'use strict'
require('./check-versions')()              // 检查 Node 和 npm 版本立即执行        主要是打包过程的文件

process.env.NODE_ENV = 'production'

const ora = require('ora')       //引入ora,可以实现loading效果
const rm = require('rimraf')          //提供node版本的UNIX的rm -rf命令
const path = require('path')
const chalk = require('chalk')         //控制台高亮显示的插件
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')        // 使用 ora 打印出 loading + log
spinner.start()       //加载时显示的文本

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err       //如果回调函数出现错误就抛出异常
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({ //标准输出流
      colors: true,
      modules: false,
      children: false, //如果您正在使用TS加载程序，将其设置为true将在生成过程中显示TysScript错误。
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
