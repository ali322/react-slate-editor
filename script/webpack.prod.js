const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConf = require('./webpack.base')
const { resolve } = require('./util')

module.exports = merge(baseConf, {
  entry: resolve('src', 'index.js'),
  output: {
    path: resolve('lib'),
    libraryTarget: 'umd',
    filename: '[name].js',
    umdNamedDefine: true
  },
  performance: {
    hints: false
  },
  stats: {
    chunks: false,
    version: false,
    colors: true
  },
  plugins: [
    new MiniCSSExtractPlugin({ filename: '[name].css' }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
})