const { join, posix } = require('path')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

exports.resolve = (...path) => join(__dirname, '..', ...path)

exports.urlLoaderOptions = (isProd = false, catalog = 'image') => {
  let opts = {
    limit: 3000
  }
  if (isProd) {
    opts.outputPath = join('asset', catalog, posix.sep)
    opts.publicPath = join('./asset', catalog, posix.sep)
  }
  return opts
}

exports.cssLoaders = (isProd = false, preprocessor = '') => {
  let loaders = ['style-loader', 'css-loader', 'resolve-url-loader']
  if (preprocessor) {
    loaders.push({
      loader: `${preprocessor}-loader`,
      options: {sourceMap: true}
    })
  }
  return isProd ? [MiniCSSExtractPlugin.loader].concat(loaders.slice(1)) : loaders
}