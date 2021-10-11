module.exports = {
  // 选项...
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '': {
        target: 'http://127.0.0.1:9091/transmission/rpc',
        changeOrigin: true,
      }
    }
  },
  outputDir: 'E:\\zpq\\torrent-web-ui\\dist',
  lintOnSave: false,
}
