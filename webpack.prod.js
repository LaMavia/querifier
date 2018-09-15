const merge = require("webpack-merge")
const webpack = require("webpack")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const base = require("./webpack.config")

module.exports = merge(base, {
  mode: "production",
  optimization: {
    minimize: true
  }
})