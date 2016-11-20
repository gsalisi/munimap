const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app/app.js',
  output: { path: __dirname, filename: './app/bundle.js' },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map'
};