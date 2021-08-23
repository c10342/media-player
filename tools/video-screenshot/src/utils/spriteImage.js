
const nsg = require("node-sprite-generator");

module.exports = function spriteImage() {
  return new Promise((resolve, reject) => {
    nsg(
      {
        src: [`${tmp}/*.png`],
        spritePath: `${tmp}/sprite.png`,
        stylesheetPath: `${tmp}/sprite.css`,
        layout: "horizontal",
        compositor: "jimp"
      },
      function (err) {
        if (err) {
          reject();
          return;
        }
        resolve();
      }
    );
  });
}
