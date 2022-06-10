'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
      // 开发环境下面的配置
  dev: {

    // Paths
    assetsSubDirectory: 'static',//静态资源文件夹，默认static，一般存放css,js,image等文件
    assetsPublicPath: '/',//发布路径（根目录）
    proxyTable: {},//利用该属性解决跨域的问题

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,//是否在编译（输入命令行npm run dev）后打开http://localhost:8080/页面，以前配置为true，近些版本改为false
    errorOverlay: true,//浏览器错误提示
    notifyOnErrors: true,//跨平台错误提示
    poll: false, // 跟devserver相关的一个配置，webpack为我们提供的devserver是可以监控文件改动的，但在有些情况下却不能工作，我们可以设置一个轮询（poll）来解决
//使用文件系统(file system)获取文件改动的通知devServer.watchOptions
    devtool: 'cheap-module-eval-source-map',//错误的源码映射，该属性为原始源代码（仅限行）不可在生产环境中使用

        cacheBusting: true,//一个配合devtool的配置，当给文件名插入新的hash导致清除缓存时是否生成souce maps，默认在开发环境下为true,//使缓存失效
    cssSourceMap: true//代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置，将大大的方便我们调试
  },
// 生产环境下面的配置
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),//index编译后生成的位置和名字，根据需要改变后缀，比如index.php

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),//编译后存放生成环境代码的位置
    assetsSubDirectory: 'static',//js,css,images存放文件夹名
    assetsPublicPath: '/',//发布的根目录，通常本地打包dist后打开文件会报错，此处修改为./。如果是上线的文件，可根据文件存放位置进行更改路径
    productionSourceMap: true,//true,打包后有相同的被压缩的文件.js.map--false就不会有
    devtool: '#source-map',//定位出错源文件

   //压缩代码，web端和服务器共同支持gzip
    //为true前确保包装了依赖
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // 运行`npm run build --report`，打包文件分析报告，vue-cli2,3有区别
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
