const LINSHARE_BACKEND_URL = process.env.LINSHARE_BACKEND_URL || 'http://localhost:28080';

module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  devServer: {
    port: 20082,
    proxy: {
      '/linshare/webservice/': {
        target: LINSHARE_BACKEND_URL,
        ws: true,
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#0372B3'
          },
          javascriptEnabled: true
        }
      }
    }
  }
};
