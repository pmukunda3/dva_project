const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',

  entry: ['./src/main.js'],
  output: {
    path: path.resolve(__dirname, '../public/'),
    filename: 'build/build.js'
  },
  devServer: {
    inline: true,
    hot: true,
    watchOptions: {
      poll: true
    },
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../public/index.html'),
      template: 'index.html',
      inject: true
    })
  ]
};
