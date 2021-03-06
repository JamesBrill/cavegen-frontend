const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const sourceRoot = path.join(__dirname, 'src')
const componentsRoot = path.join(sourceRoot, 'components')
const isProduction = process.env.NODE_ENV === 'production'

const developmentEntry = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/only-dev-server',
  './src/index'
]

const productionEntry = [
  './src/index'
]

const developmentPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new CopyWebpackPlugin([
    { from: 'static' }
  ])
]

const productionPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.ExtendedAPIPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  }),
  new CopyWebpackPlugin([
    { from: 'static' }
  ])
]

module.exports = {
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  entry: isProduction ? productionEntry : developmentEntry,
  output: {
    path: path.join(__dirname, 'dist', 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: isProduction ? productionPlugins : developmentPlugins,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: sourceRoot
      },
      {
        test: /\.json$/,
        loaders: ['json'],
        include: sourceRoot
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[local]---[hash:base64:5]!postcss-loader',
        include: sourceRoot,
        exclude: [
          path.resolve(componentsRoot, 'Slider.css'),
          path.resolve(componentsRoot, 'ZeroClipboard.css')
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: [
          path.resolve(componentsRoot, 'Slider.css'),
          path.resolve(componentsRoot, 'ZeroClipboard.css')
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.(mp3|mp4|otf|ico|jpe?g|png|gif|svg)$/,
        loader: 'file?name=[name]-[hash:base64:5].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'src': sourceRoot,
      'environment-config': path.join(__dirname, 'src/config', process.env.NODE_ENV)
    }
  },
  postcss: () => [
    require('postcss-import')({
      addDependencyTo: webpack
    }),
    require('postcss-each'),
    require('postcss-url')(),
    require('postcss-image-set'),
    require('postcss-cssnext')({
      features: {
        customProperties: {
          preserve: true
        }
      }
    }),
    require('postcss-ungroup-selector')
  ]
}
