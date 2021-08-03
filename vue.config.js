module.exports = {
  // 选项...
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '': {
        target: 'http://192.168.1.250:9091/transmission/rpc',
        changeOrigin: true,
      }
    }
  },
  lintOnSave: false,
}
