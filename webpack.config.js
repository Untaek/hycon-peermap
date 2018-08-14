const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const htmlConfig = {
  title: 'HYCON Map',
  template: path.resolve(__dirname, 'src/client/index.html'),
  filename: path.resolve(__dirname, 'dist/index.html'),
  inject: 'body',
  meta: {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
  },
}

module.exports = {
  entry: path.resolve(__dirname, "src/client/index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  plugins: [
    new HtmlWebpackPlugin(htmlConfig),
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "styles.chunk.css"
    })
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          useCache: true
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader'
        ],
      }
    ]
  },

  mode: "development",

  devtool: "source-map",
  devServer: {
    filename: "bundle.js",
    contentBase: path.resolve(__dirname, "dist"),
    historyApiFallback: true,
    inline: true,
    hot: true,
    stats: {
      colors: true
    }
  }
}