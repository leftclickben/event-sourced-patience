const { resolve } = require('path');

module.exports = {
  // http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/#sec-3
  entry: './src/index.ts',
  target: 'node',
  mode: 'production', // conf.mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        sideEffects: false
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  },
  optimization: {
    usedExports: true
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: "[name].js"
  },
  devtool: 'source-map'
};
