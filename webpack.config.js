const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",  // Entry point
  output: {
    filename: "bundle.js",   // Output file
    path: path.resolve(__dirname, "dist"), // Output folder
    clean: true, // Cleans /dist folder before each build
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve these extensions
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
        test: /\.ts$/, // Process TS files
        exclude: /node_modules/,
        use: "ts-loader", // Use ts-loader for TypeScript
      },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"],
      }
    ],
  },
};