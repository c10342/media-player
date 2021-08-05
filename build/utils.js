const path = require("path");

const root = path.resolve(__dirname, "../packages");

const del = require("del");

function getExternals(name) {
  const dir = path.resolve(root, name);
  const pck = require(path.resolve(dir, "./package.json"));

  const dependencies = pck.dependencies || {};
  const peerDependencies = pck.peerDependencies || {};

  const externals = [];

  Object.keys(dependencies).forEach((key) => externals.push(key));
  Object.keys(peerDependencies).forEach((key) => externals.push(key));

  const dep = {};

  [...new Set(externals)].forEach((key) => {
    dep[key] = key;
  });

  return dep;
}

const clean = (cleanPath) => {
  return del(cleanPath, {
    force: true
  });
};

const whiteList = ["multi-locale", "multi-utils"];

function toHump(name) {
  return name.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

module.exports = {
  getExternals,
  clean,
  whiteList,
  toHump
};
