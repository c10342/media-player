const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseConfig = require("./webpack.base.js");

const { merge } = require("webpack-merge");

const webpack = require('webpack')

const output = path.resolve(__dirname, "../examples-dist");

const entry = path.resolve(__dirname, "../examples/index.ts");

const devConfig = {
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"]
  },
  entry,
  output: {
    path: output,
    filename: "js/[name].js"
  },
  devtool: "cheap-module-source-map",
  devServer: {
    open: true,
    overlay: true, // 错误直接显示在浏览器中
    contentBase: output,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../examples/index.html"),
      filename: "index.html"
    }),
    new webpack.NamedChunksPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(baseConfig, devConfig);
