const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: "TasteBud",
    themeColor: "#C53159",
    appleMobileWebAppStatusBarStyle: 'translucent',
    appleMobileWebAppCache: "yes",
    appleMobileWebAppCapable: "yes",
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
    },
  },
  configureWebpack: {
    devtool: 'source-map'
  },
});