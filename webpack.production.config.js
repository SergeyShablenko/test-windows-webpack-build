const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const os = require('os');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const CONFIG = require('./config');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: {
                  discardComments: { removeAll: true }
                }
              }
            },
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
  plugins: [
    new webpack.LoaderOptionsPlugin({
      errorDetails: true,
      debug: false
    }),
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      beautify: false,
      compress: {
        sequences: true,
        properties: true,
        dead_code: true,
        drop_debugger: true,
        unsafe: true,
        unsafe_comps: false,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        keep_fnames: false,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        collapse_vars: false,
        reduce_vars: true,
        cascade: true,
        side_effects: true,
        pure_getters: false,
        pure_funcs: null,
        negate_iife: true,
        screw_ie8: true,
        drop_console: true,
        angular: true,
        warnings: false,
        passes: 2
      },
      sourceMap: false,
      comments: false
    }),
    new CompressionPlugin({
      asset: '[path].gz',
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8
    }),
    new CleanWebpackPlugin([CONFIG.dest], {
      root: CONFIG.root,
      verbose: true,
      dry: false
    })
  ]
};
