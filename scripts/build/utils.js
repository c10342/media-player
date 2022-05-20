const path = require("path");

const del = require("del");

const root = path.resolve(__dirname, "../../");

const packagesRoot = path.resolve(root, "./packages");

const examplesRoot = path.resolve(root, "./examples");

function resolvePackages(...data) {
  return path.resolve(packagesRoot, ...data);
}

function resolveExamples(...data) {
  return path.resolve(examplesRoot, ...data);
}

function resolveRoot(...data) {
  return path.resolve(root, ...data);
}

function ucfirst(str) {
  const firstChar = str.charAt(0).toUpperCase();
  return `${firstChar}${str.substr(1)}`;
}

function getUmdName(name) {
  return "Media" + ucfirst(name);
}

function getExternals(name) {
  const dir = resolvePackages(name);
  const pck = require(path.resolve(dir, "./package.json"));

  const dependencies = pck.dependencies || {};
  const peerDependencies = pck.peerDependencies || {};

  const externals = [];

  Object.keys(dependencies).forEach((key) => externals.push(key));
  Object.keys(peerDependencies).forEach((key) => externals.push(key));

  const dep = {};

  [...new Set(externals)].forEach((key) => {
    let rootKey = key;
    if (key.startsWith("@lin-media")) {
      rootKey = getUmdName(key.split("/")[1]);
    }
    dep[key] = { root: rootKey, commonjs: key, commonjs2: key, amd: key };
  });

  return dep;
}

const clean = (cleanPath) => {
  return del(cleanPath, {
    force: true
  });
};

module.exports = {
  getExternals,
  clean,
  root,
  packagesRoot,
  examplesRoot,
  resolveRoot,
  resolvePackages,
  resolveExamples,
  getUmdName
};
