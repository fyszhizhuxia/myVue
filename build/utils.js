'use strict'
// node.js路径模块 连接路径，例子：path.join('/foo', 'bar', 'baz/asdf');------返回: '/foo/bar/baz/asdf'
const path = require('path')
// 引入config目录下的index.js配置文件
const config = require('../config')
// 引入extract-text-webpack-plugin插件，用来将css提取到单独的css文件中
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 导入package.json文件,要使用里面的engines选项，要注意require是直接可以导入json文件的，并且requrie返回的就是json对象
const packageConfig = require('../package.json')
// exports其实就是一个对象，用来导出方法的，最终还是使用module.exports，此处导出assetsPath
//导出文件的位置，根据环境判断开发环境和生产环境，为config文件中index.js文件中定义的build.assetsSubDirectory或dev.assetsSubDirectory
exports.assetsPath = function (_path) {
    // 如果是生产环境assetsSubDirectory就是'static'，否则还是'static'（此处应该哈哈）
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
// path.join和path.posix.join的区别就是，前者返回的是完整的路径，后者返回的是完整路径的相对根路径
 // 也就是说path.join的路径是C:a/a/b/xiangmu/b，那么path.posix.join就是b
    return path.posix.join(assetsSubDirectory, _path)
    // 所以这个方法的作用就是返回一个干净的相对根路径
}
// 下面是导出cssLoaders的相关配置
exports.cssLoaders = function (options) {
    // options是用来传递参数给loader的 
  options = options || {}
// cssLoader的基本配置
  const cssLoader = {
    loader: 'css-loader',
      options: {
        // minimize表示压缩，如果是生产环境就压缩css代码
        minimize: process.env.NODE_ENV === 'production',
          // 是否开启cssmap，默认是false
      sourceMap: options.sourceMap
    }
  }
  //负责进一步处理 CSS 文件，比如添加浏览器前缀，压缩 CSS 等
//   通过options.usePostCSS属性来判断是否使用postcssLoader中压缩等方法
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
    // 将上面的基础cssLoader配置放在一个数组里面
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
   // 如果该函数传递了单独的loader就加到这个loaders数组里面，这个loader可能是less,sass之类的
        if (loader) {
        // 加载对应的loader
      loaders.push({
          loader: loader + '-loader',
          //Object.assign是es6语法的浅拷贝，后两者合并后复制完成赋值
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }


    // 注意这个extract是自定义的属性，可以定义在options里面，主要作用就是当配置为true就把文件单独提取，false表示不单独提取，这个可以在使用的时候单独配置，瞬间觉得vue作者好牛逼
        if (options.extract) {
        //ExtractTextPlugin可提取出文本，代表首先使用上面处理的loaders，当未能正确引入时使用vue-style-loader
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
        } else {
               //返回vue-style-loader连接loaders的最终值
      return ['vue-style-loader'].concat(loaders)
    }
    // 上面这段代码就是用来返回最终读取和导入loader，来处理对应类型的文件
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),// css对应 vue-style-loader 和 css-loader
    postcss: generateLoaders(),// postcss对应 vue-style-loader 和 css-loader
    less: generateLoaders('less'),//less对应 vue-style-loader 和 less-loader
    sass: generateLoaders('sass', { indentedSyntax: true }),// sass对应 vue-style-loader 和 sass-loader
    scss: generateLoaders('sass'),//scss对应 vue-style-loader 和 sass-loader
    stylus: generateLoaders('stylus'),// stylus对应 vue-style-loader 和 stylus-loader
    styl: generateLoaders('stylus')// styl对应 vue-style-loader 和 styl-loader
  }
}

// 下面这个主要处理import这种方式导入的文件类型的打包，上面的exports.cssLoaders是为这一步服务的
  //将各种css,less,sass等综合在一起得出结果输出output
exports.styleLoaders = function (options) {
    const output = []
    // 下面就是生成的各种css文件的loader对象
  const loaders = exports.cssLoaders(options)
    // 把每一种文件的laoder都提取出来
  for (const extension in loaders) {
      const loader = loaders[extension]
      // 把最终的结果都push到output数组中
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

//处理错误的
exports.createNotifierCallback = () => {
    //支持使用node发送跨平台的本地通知
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return
//当报错时输出错误信息的标题，错误信息详情，副标题以及图标
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
