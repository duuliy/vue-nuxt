'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')  //node自带文件路径插件

module.exports = {
  //开发环境
  dev: {

    // Paths
    assetsSubDirectory: 'static',     // 编译输出的二级目录
    assetsPublicPath: '/',                   // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    proxyTable: {},          // 需要 proxyTable 代理的接口（可跨域

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined  // 运行测试页面的端口
    autoOpenBrowser: false,  //是否自动打开浏览器
    errorOverlay: true,  //  在浏览器是否展示错误蒙层（遮住层）
    notifyOnErrors: true,  //错误打印
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-  //以轮询的方式去检查文件是否改变,避免webpack-dev-servr检查不及时

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',    //报错文件位置插件,仅用于生产环境

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,   //是否通过在文件名称后面添加一个查询字符串来创建source map的缓存

    cssSourceMap: true       // 是否开启 cssSourceMap
  },
//生产环境
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),   // 编译注入的 index.html 文件,必须是本地的绝对路径

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),  // 编译输出的静态资源根路径
    assetsSubDirectory: 'static',  // 编译输出的二级目录
    assetsPublicPath: '/',    // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名

    /**
     * Source Maps
     */

    productionSourceMap: true,     //找出打包后报错位置
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,   // 是否开启 gzip压缩
    productionGzipExtensions: ['js', 'css'],   //需要使用 gzip 压缩的文件扩展名

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report   //一个实用工具,用于分析项目的依赖关系，若true会在浏览器中生成一份bundler报告
  }
}
