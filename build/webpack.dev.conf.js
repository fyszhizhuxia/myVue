'use strict'
// 引入当前目录中的utils工具配置文件
const utils = require('./utils')
// 引入webpack来使用webpack内置插件
const webpack = require('webpack')
// 引入config目录中的index.js配置文件(默认)
const config = require('../config')
// 引入webpack-merge插件用来合并webpack配置对象，可以把webpack配置文件拆分成几个小的模块，然后合并（这里用来合并当前目录下的webpack.base.conf.js配置文件）
const merge = require('webpack-merge')
// 引入nodejs路径模块
const path = require('path')
// 引入当前目录下的webpack.base.conf.js配置文件（打包的基础配置）
const baseWebpackConfig = require('./webpack.base.conf')
// 用来复制文件或者文件夹到指定的目录的
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成html文件的插件，能够把资源自动加载到html文件，引入了外部资源，，可通过此项进行多页面的配置
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 美化webpack的错误信息和日志的插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 查看空闲端，端口进程，默认情况下搜索8000这个端口
const portfinder = require('portfinder')
//processs为node的一个全局对象获取当前程序的环境变量，即host
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const generateMock = require('./generate-mock');
const proxy = require('./proxy.config.js');

// 把当前的配置对象和基础的配置对象合并
const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
      //规则是工具utils中处理出来的styleLoaders，生成了css，less,postcss等规则
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },

  devtool: config.dev.devtool, //调试用

  // these devServer options should be customized in /config/index.js
  devServer: {
      clientLogLevel: 'warning',//控制台显示的选项有none, error, warning 或者 info
      //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
      },
      // 挂载mock路由
    // 提供在服务器内部先于所有其他中间件执行自定义中间件的功能。这可以用于定义自定义处理程序
      before: function(app, server, compiler) {
        process.env.SERVE === 'mock' && generateMock(app);
    },
    hot: true,//自动刷新
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,//压缩
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,//调试时自动打开浏览器
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,// warning 和 error 都要显示
    publicPath: config.dev.assetsPublicPath,
    // proxy: config.dev.proxyTable,//接口代理
    proxy,//接口代理
    quiet: true, //控制台是否禁止打印警告和错误,若用FriendlyErrorsPlugin 此处为 true
    watchOptions: {
      poll: config.dev.poll,// 文件系统检测改动
    }
  },
    plugins: [
      // DefinePlugin内置webpack插件，专门用来定义全局变量的，下面定义一个全局变量 process.env 并且值是如下
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    //模块热替换插件，修改模块时不需要刷新页面
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // 显示文件的正确名字
    // webpack编译错误的时候，来中断打包进程，防止错误代码打包到文件中
    new webpack.NoEmitOnErrorsPlugin(),
    // 是用来生成html文件的，有很灵活的配置项，下面是基本的一些用法
    new HtmlWebpackPlugin({
      filename: 'index.html',//生成的文件的名称
      template: 'index.html',//可以指定模块html文件
      inject: true// 将js文件放到body标签的结尾
    }),
    // 用来复制一个单独的文件或者整个目录到新建的文件夹下（复制自定义的静态资源）
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']//忽略.*的文件
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
      //查找端口号
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
 //端口被占用时就重新设置evn和devServer的端口
      process.env.PORT = port
      devWebpackConfig.devServer.port = port
 //友好地输出信息
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
