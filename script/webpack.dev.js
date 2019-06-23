const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConf = require('./webpack.base')
const InjectHTMLPlugin = require('inject-html-webpack-plugin')
const { resolve } = require('./util')

module.exports = merge(baseConf, {
  entry: ['react-hot-loader/patch', resolve('doc', 'src', 'index.js')],
  output: {
    path: resolve('lib'),
    filename: 'index.js',
    publicPath: '/hmr/'
  },
  devtool: '#source-map',
  devServer: {
    contentBase: [resolve('doc', 'src')],
    compress: true,
    historyApiFallback: true,
    noInfo: false
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors'
        },
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'async',
          minChunks: 2,
          name: 'async-vendors'
        }
      }
    },
    runtimeChunk: { name: 'runtime' }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new InjectHTMLPlugin({
      transducer: '/hmr/',
      chunks: ['main', 'vendors', 'async-vendors', 'runtime'],
      filename: resolve('doc', 'src', 'index.html')
    })
  ]
})
