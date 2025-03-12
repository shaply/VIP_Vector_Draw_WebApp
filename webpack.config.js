const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",  // Entry point
  output: {
    filename: "bundle.js",   // Output file
    path: path.resolve(__dirname, "dist"), // Output folder
    clean: true, // Cleans /dist folder before each build
  },
  mode: "development", // Set to "production" when deploying
  devServer: {
    static: "./dist",
    open: true, // Auto open browser
    hot: true,  // Hot module reloading
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Use existing HTML file
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // Process JS files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Optional: Transpile modern JS
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"],
      }
    ],
  },
};