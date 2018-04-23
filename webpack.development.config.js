const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const autoprefixer = require('autoprefixer');

const CONFIG = require('./config');
const WEBPACK_PORT = CONFIG.port + 1;

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
              failOnError: false,
              fix: false,
              quiet: false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [autoprefixer];
                }
              }
            },
            { loader: 'sass-loader' }
          ]
        })
      }
    ]
  },
  watch: true,
  cache: true,
  devtool: 'inline-source-map',
  devServer: {
    clientLogLevel: 'none',
    historyApiFallback: true,
    inline: true,
    quiet: false,
    noInfo: false,
    disableHostCheck: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: true,
      chunkModules: false
    },
    port: WEBPACK_PORT
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      errorDetails: true,
      debug: true
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new BrowserSyncPlugin({
      open: CONFIG.mode,
      host: CONFIG.host,
      port: CONFIG.port,
      proxy: {
        target: `localhost:${WEBPACK_PORT}`,
        middleware: CONFIG.api.map(api => proxyMiddleware(api, {
          target: CONFIG.proxy,
          secure: !/^https/.test(CONFIG.proxy)
        }))
      }
    })
  ]
};
