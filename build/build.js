'use strict'
//检查版本的文件  版本有要求"engines": {"node": ">= 6.0.0","npm": ">= 3.0.0"},加()代表直接调用该函数
require('./check-versions')()
//process是node中的global全局对象的属性，env设置环境变量(当前是生成环境)
process.env.NODE_ENV = 'production'
// 是一个命令行转圈圈动画插件，好看用的（加载动画）
const ora = require('ora')
// 用来执行UNIX命令rm和-rf的用来删除文件夹和文件（删除文件）
const rm = require('rimraf')
// node.js路径模块 连接路径，例子：path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');// 返回: '/foo/bar/baz/asdf'
const path = require('path')
//// chalk插件，作用：在控制台中输出不同的颜色的字，用法：chalk.blue('Hello world')，只能改变命令行中的字体颜色
const chalk = require('chalk')
// 引入webpack模块使用内置插件和webpack方法
const webpack = require('webpack')
//commonJs风格，引入文件模块， 默认读取下面的index.js文件
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
// 开启转圈圈动画：调用start的方法实现加载动画，优化用户体验
const spinner = ora('building for production...')
spinner.start()

// 调用rm方法，删除dist文件再生成新文件，因为有时候会使用hash来命名，删除整个文件可避免冗余
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
     // 如果删除的过程中出现错误，停止转圈，就抛出这个错误，同时程序终止
    if (err) throw err
    // 没有错误，就执行webpack编译
    webpack(webpackConfig, (err, stats) => {
    // 这个回调函数是webpack编译过程中执行
    spinner.stop()// 停止转圈圈动画
        if (err) throw err　// 如果有错误就抛出错误
        // 没有错误就执行下面的代码，process.stdout.write和console.log类似，输出对象
        process.stdout.write(stats.toString({
        // stats对象中保存着编译过程中的各种消息
      colors: true,// 增加控制台颜色开关
      modules: false,// 不增加内置模块信息
      children: false, // 不增加子级信息
      chunks: false,// 允许较少的输出
      chunkModules: false // 不将内置模块的信息加到包信息
    }) + '\n\n')
    //以上就是在编译过程中，持续打印消息 
    // 下面是编译成功的消息
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
