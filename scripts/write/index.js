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

function getTplFiles(fileDir) {
  const fileArr = [];
  const fileList = fs.readdirSync(fileDir);
  for (let i = 0; i < fileList.length; i++) {
    const fullPath = path.resolve(fileDir, fileList[i]);
    const status = fs.statSync(fullPath);
    if (status.isDirectory()) {
      fileArr.push(...getTplFiles(fullPath));
    } else {
      fileArr.push(fullPath);
    }
  }
  return fileArr;
}

function getCompFiles(tplSrc, fileDir) {
  return path.join(compomentPath, tplSrc.replace(fileDir, ""));
}

function makeDir(dir) {
  if (fs.existsSync(dir)) return true;
  if (makeDir(path.dirname(dir))) {
    fs.mkdirSync(dir);
    return true;
  }
}

function writeTpl() {
  const fileDir = path.resolve(__dirname, "./template");
  const tplList = getTplFiles(fileDir);
  const parmas = {
    name: componentName,
    importName: toHump(componentName)
  };

  tplList.forEach((tplSrc) => {
    const result = artTemplate(tplSrc, parmas);
    let compSrc = getCompFiles(tplSrc, fileDir);
    compSrc = compSrc.replace(".art", "");
    makeDir(path.dirname(compSrc));
    fs.writeFileSync(compSrc, result);
  });
  console.log(`${componentName}模板创建成功`);
}

writeTpl();
