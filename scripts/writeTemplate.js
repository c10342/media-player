const artTemplate = require("art-template");
const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "../packages");

const argv = process.argv;

const componentName = argv[2];

function toHump(name) {
  const reg = /-(\w)/g;
  if (name.match(reg)) {
    name = name.replace(reg, function (all, letter) {
      return letter.toUpperCase();
    });
  }
  name = name.replace(/^(\w)/, function (all, letter) {
    return letter.toUpperCase();
  });
  return name;
}

// 检查有没有输入组件名
if (!componentName) {
  console.log("请输入组件名");
  return;
}

const compomentPath = path.resolve(packageRoot, componentName);

// 检查输入的组件名是否已经存在了
if (fs.existsSync(compomentPath)) {
  console.log(`${componentName}组件已经存在了`);
  return;
}

// 创建组件根目录
fs.mkdirSync(compomentPath);
// 创建src目录
const compomentSrcPath = path.resolve(compomentPath, "src");
fs.mkdirSync(compomentSrcPath);
// 创建__tests__目录
const testsSrcPath = path.resolve(compomentPath, "__tests__");
fs.mkdirSync(testsSrcPath);

function writePakcageTpl() {
  const parmas = {
    name: componentName
  };
  const result = artTemplate(
    path.resolve(__dirname, "./template/package.art"),
    parmas
  );
  fs.writeFileSync(path.resolve(compomentPath, "package.json"), result);
}

function writeIndexTpl() {
  const parmas = {
    name: componentName,
    importName: toHump(componentName)
  };
  const result = artTemplate(
    path.resolve(__dirname, "./template/index.art"),
    parmas
  );
  fs.writeFileSync(path.resolve(compomentPath, "index.ts"), result);
}

function writeReadmeTpl() {
  const parmas = {
    name: componentName,
    importName: toHump(componentName)
  };
  const result = artTemplate(
    path.resolve(__dirname, "./template/readme.art"),
    parmas
  );
  fs.writeFileSync(path.resolve(compomentPath, "README.md"), result);
}

function writeTestTpl() {
  const parmas = {
    name: componentName,
    componentName: toHump(componentName)
  };
  const result = artTemplate(
    path.resolve(__dirname, "./template/test.art"),
    parmas
  );
  fs.writeFileSync(path.resolve(testsSrcPath, "index.test.ts"), result);
}

function writeTpl() {
  writePakcageTpl();
  writeIndexTpl();
  writeReadmeTpl();
  writeTestTpl();
  console.log(`${componentName}模板创建成功`);
}

writeTpl();
