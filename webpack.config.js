const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: "body"
    }),
    new CopyPlugin({
      patterns: [
        { from: "assets", to: "assets" }
      ]
    })
  ],
  devServer: {
    static: [
      {
      directory: path.join(__dirname, "dist")
      },
      {
        directory: path.join(__dirname, "assets"),
        publicPath: "/assets"
      }
    ],
    compress: true,
    port: 3000,
    open: true
  }
};