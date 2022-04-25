const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // publicPath: "/airportal/",
  transpileDependencies: true,
    devServer: {
        host: "localhost",
        port: 8889,
        https: false, // https:{type:Boolean}
        open: true
    }
})
