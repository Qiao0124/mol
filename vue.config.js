const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false, // 如果不需要fs模块，将其置为false
        path: require.resolve("path-browserify"),
      },
    },
  },
});
