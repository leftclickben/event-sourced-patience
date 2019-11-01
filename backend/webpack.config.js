const path = require('path');
const { readFileSync } = require('fs');
const { yamlParse } = require('yaml-cfn');

const cfn = yamlParse(readFileSync('./template.yaml'));

const entries = Object.values(cfn.Resources)
// Find nodejs functions
  .filter(v => v.Type === 'AWS::Serverless::Function')
  .filter(v =>
    (v.Properties.Runtime && v.Properties.Runtime.startsWith('nodejs')) ||
    (!v.Properties.Runtime && cfn.Globals.Function.Runtime)
  )
  .map(v => ({
    // Isolate handler src filename
    handlerFile: v.Properties.Handler.split('.')[0],
    // Build handler dst path
    CodeUriDir: v.Properties.CodeUri.split('/').splice(2).join('/')
  }))
  .reduce(
    (entries, v) =>
      Object.assign(
        entries,
        // Generate {outputPath: inputPath} object
        {[`${v.CodeUriDir}/${v.handlerFile}`]: `./src/${v.CodeUriDir}/${v.handlerFile}.ts`}
      ),
    {}
  );

module.exports = {
  // http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/#sec-3
  entry: entries,
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
  // AWS SDK is included in the Lambda runtime, so we declare it as an external module here so it isn't bundled.
  externals: ['aws-sdk'],
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
    path: path.resolve(__dirname, 'build'),
    filename: "[name].js",
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map'
};
