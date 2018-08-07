'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')   //通过“通用”配置，我们不必在环境特定(environment-specific)的配置中重复代码。  也就是公共
const baseWebpackConfig = require('./webpack.base.conf')   //公共配置
const CopyWebpackPlugin = require('copy-webpack-plugin')   //复制自定义的静态资源文件到dist/static文件夹中
const HtmlWebpackPlugin = require('html-webpack-plugin')   // 一个可以插入 html 并且创建新的 .html 文件的插件 用于dist里面
const ExtractTextPlugin = require('extract-text-webpack-plugin')   //将 css 文件分离出来
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')  //一个优化/最小化css资源的插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')       //删除没有依赖的并压缩代码

//单元测试的路径
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

  
const webpackConfig = merge(baseWebpackConfig, {  //合并 webpack.base.conf.js中的配置,里面具体的配置参考webpack.base.conf.js里面的注释
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,    //同上
      extract: true,      // //将 css 文件分离出来
      usePostCSS: true     //同上
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,   //同上
    filename: utils.assetsPath('js/[name].[chunkhash].js'),   //同上
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')        // 没有指定输出名的文件输出的文件名
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({           // 一个可以插入 html 并且创建新的 .html 文件的插件
      'process.env': env
    }),
    new UglifyJsPlugin({           //删除没有依赖的并压缩代码
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,    //common.js规范的块
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({        //同上
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({        //同上/ 输入输出的 .html 文件
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,     // 是否注入 html
      minify: {        // 压缩的方式
        removeComments: true,     //移除带html的注释
        collapseWhitespace: true,       //移除空格
        removeAttributeQuotes: true      //移除属性的引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'          //资源按照依赖关系去插入
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),    //哈希化
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),       
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({        //将引用的库文件拆出来打包到一个[name].js文件中  vendor
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (         // 任何一个从node_modules中引用的模块都会被打包进来
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(                               
            path.join(__dirname, '../node_modules')          
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({           //把webpack的runtime和manifest这些webpack管理所有模块交互的代码打包到[name].js文件中,防止build之后vendor的hash值被更新
      name: 'manifest',                
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([            //复制自定义的静态资源文件到dist/static文件夹中
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {              // 开启 gzip 的情况下使用下方的配置
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(               // 使用 compression-webpack-plugin 插件进行压缩
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',       //目标资源名称
      algorithm: 'gzip',    //压缩方式
      test: new RegExp(         //所有匹配该正则的资源都会被处理。默认值是全部资源。
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,  //只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
      minRatio: 0.8      //只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
    })
  )
}

//配置项目分析工具加载下方插件    vue谷歌工具
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
