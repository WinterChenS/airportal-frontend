const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
    devServer: {
        host: "localhost",
        port: 8889,
        https: false, // https:{type:Boolean}
        open: true
    }
})
