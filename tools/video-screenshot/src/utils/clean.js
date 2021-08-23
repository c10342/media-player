const del = require("del");

module.exports = function clean(cleanPath) {
  return del(cleanPath, {
    force: true
  });
};
