import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;
const filename = `react-erux${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },

  entry: ['./src/index'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'React Erux',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    ...(NODE_ENV === 'production' && [
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ])
  ]
};
