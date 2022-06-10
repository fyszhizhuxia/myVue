// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},//用于@important导入css文件
    "postcss-url": {},//路径引入css文件或node_modules文件
    // 编辑目标浏览器：使用package.json中的“browserslist”字段
    "autoprefixer": {}
  }
}
