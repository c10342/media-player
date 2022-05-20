const webpack = require("webpack");

const { merge } = require("webpack-merge");

const path = require("path");

const fs = require("fs");

const baseConfig = require("./webpack.base.js");

const {
  getExternals,
  clean,
  packagesRoot,
  resolveRoot,
  resolvePackages,
  getUmdName
} = require("./utils.js");

const tempTypesDir = resolveRoot("./temp_types");

function createConfig(name) {
  const config = {
    entry: resolvePackages(`./${name}/index.ts`),
    externals: {
      ...getExternals(name)
    },
    output: {
      path: resolvePackages(`./${name}/dist`),
      filename: "index.js",
      libraryTarget: "umd",
      library: getUmdName(name)
    }
  };
  return config;
}

function buildOne(name) {
  return new Promise(async (re, reject) => {
    await clean(resolvePackages(`./${name}/dist`));
    await clean(resolvePackages(`./${name}/types`));
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
    resolvePackages(`./${name}/types`)
  );
}

async function build() {
  const task = [];
  const list = fs.readdirSync(packagesRoot);
  list.forEach((name) => {
    task.push(buildOne(name));
  });
  await Promise.all(task);
  list.forEach((name) => moveDTS(name));
  await clean(tempTypesDir);
  console.log("done");
}

build();
