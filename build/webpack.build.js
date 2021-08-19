const webpack = require("webpack");

const { merge } = require("webpack-merge");

const baseConfig = require("./webpack.base.js");

const path = require("path");

const fs = require("fs");

const { getExternals, clean } = require("./utils.js");

const root = path.resolve(__dirname, "../packages");

const resolve = (...args) => {
  return path.resolve(root, ...args);
};

function createConfig(name) {
  const config = {
    entry: resolve(`./${name}/index.ts`),
    externals: {
      ...getExternals(name)
    },
    output: {
      path: resolve(`./${name}/dist`),
      filename: "index.js",
      libraryTarget: "commonjs2"
    }
  };
  return config;
}

const buildOne = async (name) => {
  await clean(resolve(`./${name}/dist`));
  const options = merge(baseConfig, createConfig(name));
  webpack(options, (err, stats) => {
    if (err || stats.hasErrors()) {
      // 构建过程出错
      console.log(stats.compilation.errors);
      return;
    }
    console.log(name, "done");
  });
};

fs.readdirSync(root).forEach((name) => {
  buildOne(name);
});
// buildOne();

// module.exports = options;
