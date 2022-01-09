const HtmlWebpackPlugin = require("html-webpack-plugin");

const { merge } = require("webpack-merge");

const webpack = require("webpack");

const baseConfig = require("./webpack.base.js");

const { resolveExamples } = require("./utils");

const output = resolveExamples("./dist");

const devConfig = {
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"]
  },
  entry: resolveExamples("./index.ts"),
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
      template: resolveExamples("./index.html"),
      filename: "index.html"
    }),
    new webpack.NamedChunksPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(baseConfig, devConfig);
