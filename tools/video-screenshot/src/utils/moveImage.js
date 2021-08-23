
const Jimp = require("jimp");
module.exports = function moveImage(data) {
    return new Promise((resolve, reject) => {
      Jimp.read(`${tmp}/sprite.png`, function (err, lenna) {
        if (err) {
          reject();
          return;
        }
        lenna
          .quality(parseInt(data.quality))
          .write(path.resolve(process.cwd(), data.output));
        resolve();
      });
    });
  }