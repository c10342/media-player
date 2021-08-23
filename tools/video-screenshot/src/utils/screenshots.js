module.exports = function screenshots(data) {
  return new Promise((resolve, reject) => {
    ffmpeg(path.resolve(process.cwd(), data.input))
      .screenshots({
        count: data.count,
        timestamps: Array.from({ length: parseInt(data.count) }, (v, i) => i),
        // filename: 'thumbnail-at-%s-seconds.png',
        filename: "screenshot%00i.png",
        folder: tmp,
        size: "160x?"
      })
      .on("end", (error) => {
        if (error) {
          reject();
          return;
        }
        resolve();
      });
  });
};
