const path = require("path");
const userInfo = require("./userInfo");
module.exports = {
  // 七牛云配置信息
  accessKey: userInfo.accessKey,
  secretKey: userInfo.secretKey,
  bucket: "lin-player",
  // 上传到七牛云的目录
  basePath: path.join(__dirname, "../../docs/.vuepress/dist")
};
