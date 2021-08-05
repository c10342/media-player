const webpack = require("webpack");

const { merge } = require("webpack-merge");

const baseConfig = require("./webpack.base.js");

const path = require("path");

const { getExternals, clean } = require("./utils.js");

const root = path.resolve(__dirname, "../packages/utils");

const resolve = (...args) => {
  return path.resolve(root, ...args);
};

const config = {
  entry: resolve("./index.ts"),
  externals: {
    ...getExternals("utils")
  },
  output: {
    path: resolve("./dist"),
    filename: "index.js",
    libraryTarget: "commonjs2"
  }
};

const options = merge(baseConfig, config);

const build = async () => {
  await clean(resolve("./dist"));
  webpack(options, (err, stats) => {
    if (err || stats.hasErrors()) {
      // 构建过程出错
      console.log(stats.compilation.errors);
      return;
    }
    console.log("utils", "done");
  });
};

build();

// module.exports = options;
