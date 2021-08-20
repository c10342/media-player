const webpack = require("webpack");

const { merge } = require("webpack-merge");

const baseConfig = require("./webpack.base.js");

const path = require("path");

const fs = require("fs");

const { getExternals, clean,firstCharUpper } = require("./utils.js");

const root = path.resolve(__dirname, "../packages");

const tempTypesDir = path.resolve(__dirname, "../temp_types");

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
      libraryTarget: "umd",
      libraryExport: 'default',
      library:`Media${firstCharUpper(name)}`
    }
  };
  return config;
}

function buildOne(name) {
  return new Promise(async (re, reject) => {
    await clean(resolve(`./${name}/dist`));
    await clean(resolve(`./${name}/types`));
    const options = merge(baseConfig, createConfig(name));
    webpack(options, (err, stats) => {
      if (err || stats.hasErrors()) {
        // 构建过程出错
        console.log(stats.compilation.errors);
        reject();
        return;
      }
      console.log(name, "done");
      re();
    });
  });
}

function moveDTS(name) {
  fs.renameSync(
    path.join(tempTypesDir, `./packages/${name}`),
    resolve(`./${name}/types`)
  );
}

async function build() {
  const task = [];
  const list = fs.readdirSync(root);
  list.forEach((name) => {
    task.push(buildOne(name));
  });
  await Promise.all(task);
  list.forEach((name) => moveDTS(name));
  await clean(tempTypesDir);
  console.log("done");
}

build();
