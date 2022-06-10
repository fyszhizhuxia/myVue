'use strict'
// 这个配置文件是webpack生产环境的核心配置文件
// 引入nodejs的路径模块
const path = require('path')
// 引入当前目录中的utils工具配置文件
const utils = require('./utils')
// 引入webpack来使用webpack内置插件
const webpack = require('webpack')
//引入config目录中的index.js配置文件 (默认)
const config = require('../config')
// 引入webpack-merge插件用来合并webpack配置对象，可以把webpack配置文件拆分成几个小的模块，然后合并（这里用来合并当前目录下的webpack.base.conf.js配置文件）
const merge = require('webpack-merge')
// 引入当前目录下的webpack.base.conf.js配置文件（打包的基础配置）
const baseWebpackConfig = require('./webpack.base.conf')
//用来复制文件或者文件夹到指定的目录的
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成html文件的插件，能够把资源自动加载到html文件中
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 用来将bundle中的css等文件产出单独的bundle文件的
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//压缩提取出的css，并解决extract-text-webpack-plugin分离出的js重复问题(多个文件引入同一css文件)（两个插件比较类似）
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//压缩js文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 如果当前环境变量NODE_ENV的值是testing，则导入 test.env.js配置文，设置env为"testing"
// 如果当前环境变量NODE_ENV的值不是testing，则设置env为"production"
const env = require('../config/prod.env')
// 把当前的配置对象和基础的配置对象合并
const webpackConfig = merge(baseWebpackConfig, {
    module: {
      // 下面就是把utils配置好的处理各种css类型的配置拿过来，和dev设置一样，就是这里多了个extract: true，此项是自定义项，设置为true表示，生成独立的文件
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
    },
     // devtool开发工具，用来生成个sourcemap方便调试
  // 按理说这里不用生成sourcemap多次一举，这里生成了source-map类型的map文件，只用于生产环境
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
       // 打包后的文件放在dist目录里面
        path: config.build.assetsRoot,
          // 文件名称使用 static/js/[name].[chunkhash].js, 其中name就是main,chunkhash就是模块的hash值，用于浏览器缓存的
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
     // chunkFilename是非入口模块文件，也就是说filename文件中引用了chunckFilename
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
       // 下面是利用DefinePlugin插件，定义process.env环境变量为env
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJsPlugin插件是专门用来压缩js文件的
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false// 警告：true保留警告，false不保留
        }
      },
      sourceMap: config.build.productionSourceMap,// 压缩后是否生成map文件
      parallel: true
    }),
     // 生成独立的css文件，下面是生成独立css文件的名称
      new ExtractTextPlugin({
        //抽取文本。比如打包之后的index页面有style插入，就是这个插件抽取出来的，减少请求
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,//为falsez则不会从代码分割块中提取CSS。
    }),
      // 压缩css文件
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
     // 生成html页面

      new HtmlWebpackPlugin({
       //非测试环境生成index.html
      filename: process.env.NODE_ENV === 'testing'
      ? 'index.html'
      : config.build.index,
      template: 'index.html',
          inject: true,// 将js文件放到body标签的结尾
        // 压缩产出后的html页面
      minify: {
        removeComments: true,//删除注释
        collapseWhitespace: true,//删除空格
        removeAttributeQuotes: true//删除属性的引号   
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'//模块排序，按照我们需要的顺序排序（分类要插到html页面的模块）
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    // 将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序的运行速度（抽取公共模块）
      new webpack.optimize.CommonsChunkPlugin({
        // common 模块的名称
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
           // 将所有依赖于node_modules下面文件打包到vendor中
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),

       // 把webpack的runtime代码和module manifest代码提取到manifest文件中，防止修改了代码但是没有修改第三方库文件导致第三方库文件也打包的问题
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // 这个实例从代码分割的块中提取共享块，并将它们打包成一个单独的块，类似于供应商块 
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    // 比如打包完之后需要把打包的文件复制到dist里面
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
       // 开启Gzi压缩打包后的文件，老铁们知道这个为什么还能压缩吗？？，就跟你打包压缩包一样，把这个压缩包给浏览器，浏览器自动解压的
    // 你要知道，vue-cli默认将这个神奇的功能禁用掉的，理由是Surge 和 Netlify 静态主机默认帮你把上传的文件gzip了
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(// 这里是把js和css文件压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
    // 打包编译后的文件打印出详细的文件信息，vue-cli默认把这个禁用了，个人觉得还是有点用的，可以自行配置
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
