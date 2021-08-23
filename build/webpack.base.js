const path = require("path");

const baseConfig = {
  mode: "production",
  performance: {
    hints: false
  },
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@media": path.join(__dirname, "../packages")
    },
    mainFields: ["doc", "main"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets/images/",
            limit: 40000,
            esModule: false
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets/fonts/",
            limit: 40000,
            esModule: false
          }
        }
      },
      {
        test: /\.art$/,
        loader: "art-template-loader"
      }
    ]
  }
};

module.exports = baseConfig;
