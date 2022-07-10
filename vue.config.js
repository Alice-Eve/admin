const { defineConfig } = require('@vue/cli-service')

let proxyObj = {};

proxyObj["/"] = {
  ws: false,
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/':''
  }
}

module.exports = defineConfig({
  devServer: {
    host: 'localhost',
    port: 8081,
    proxy: proxyObj
  },
  transpileDependencies: true
})
