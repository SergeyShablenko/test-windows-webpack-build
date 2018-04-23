const Path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;

const ENV = process.env.NODE_ENV || 'development';
const CONFIG = require('./config');
const WEBPACK_CONFIG = require('./webpack.' + ENV + '.config.js');

module.exports = Object.assign({}, WEBPACK_CONFIG, {
  entry: {
    app: CONFIG.entry
  },
  output: {
    path: CONFIG.dest,
    filename: ENV === 'production' ? '[chunkhash].js' : '[name].[chunkhash].js',
    chunkFilename: ENV === 'production' ? '[chunkhash].js' : '[name].[chunkhash].js',
    publicPath: CONFIG.publicPath
  },
  module: {
    rules: [].concat(
        WEBPACK_CONFIG.module && WEBPACK_CONFIG.module.rules || [],
        [
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: {
              loader: 'url-loader',
              options: { limit: 10000, minetype: 'application/font-woff' }
            }
          },
          {
            test: /\.(ttf|eot|svg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'file-loader'
          }
        ]
    )
  },
  plugins: [].concat(
      [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(ENV) }),
        new webpack.ProvidePlugin({
          React: 'react',
          numbro: 'numbro',
          moment: 'moment'
        }),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: module => module.context && module.context.includes('node_modules')
        }),
        new webpack.optimize.CommonsChunkPlugin({
          async: 'used-twice',
          minChunks: (module, count) => count >= 2
        })
      ],
      WEBPACK_CONFIG.plugins || [],
      [
        new ExtractTextPlugin({ filename: ENV === 'production' ? '[chunkhash].css' : '[name].[chunkhash].css' }),
        new HtmlWebpackPlugin({
          filename: Path.resolve(`${CONFIG.dest}/index.html`),
          template: Path.resolve(`${CONFIG.entry}/index.ejs`),
          minify: {
            removeRedundantAttributes: true,
            removeComments: true,
            minifyCSS: true,
            collapseWhitespace: true
          },
          inject: true
        }),
        new HtmlWebpackPlugin({
          filename: Path.resolve(`${CONFIG.dest}/maintenance.html`),
          template: Path.resolve(`${CONFIG.entry}/index.ejs`),
          minify: {
            removeRedundantAttributes: true,
            removeComments: true,
            minifyCSS: true,
            collapseWhitespace: true
          },
          maintenance: true,
          inject: true
        }),
        new CriticalPlugin({
          src: 'index.html',
          inline: true,
          minify: true,
          dest: 'index.html',
          include: [/^#loading/]
        }),
        new CriticalPlugin({
          src: 'maintenance.html',
          inline: true,
          minify: true,
          dest: 'maintenance.html',
          include: [/^#loading/]
        })
      ]
  )
});
