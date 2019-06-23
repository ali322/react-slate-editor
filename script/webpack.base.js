const { urlLoaderOptions, cssLoaders, resolve } = require('./util')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.less$/,
        loader: cssLoaders(isProd, 'less'),
        exclude: resolve('node_modules')
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: urlLoaderOptions(isProd)
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
}