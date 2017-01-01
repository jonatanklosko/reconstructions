const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const sourcePath = path.resolve(__dirname, 'client/app');
const destinationPath = path.resolve(__dirname, 'client/build');

const production = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';

let config = {
  context: sourcePath,
  entry: test ? '' : './app.js',
  output: test ? {} : {
    path: destinationPath,
    filename: production ? '[name].[hash].js' : '[name].bundle.js'
  },
  resolve: {
    root: sourcePath,
    extensions: ['', '.js', '.html', '.scss']
  },
  debug: !production,
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['ng-annotate', 'babel?presets[]=es2015'],
      exclude: /node_modules/
    }, {
      test: /\.(view|template)\.html$/,
      loader: 'html'
    }, {
      /* HTML partial loader for ng-include. */
      test: /\.partial.html$/,
      loaders: [`ngtemplate?relativeTo=${sourcePath}/`, 'html']
    }, {
      test: require.resolve('jquery'),
      loaders: ['expose?$', 'expose?jQuery']
    }]
  },
  plugins: [
    new CleanWebpackPlugin(destinationPath)
  ],
  devServer: {
    contentBase: destinationPath
  }
};

let styleLoader = { test: /\.scss$/ };
if(test) {
  styleLoader.loader = 'null';
} else if(production) {
  styleLoader.loader = ExtractTextPlugin.extract('style', ['css', 'sass']);
} else {
  styleLoader.loaders = ['style', 'css', 'sass'];
}
config.module.loaders.push(styleLoader);

if(!test) {
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: 'views/layout/layout.ejs',
      inject: 'body',
      base: production ? '/reconstructions/' : '/' /* Repository path for GitHub pages. */
    })
  );
}

if(production) {
  config.plugins.push(
    new ExtractTextPlugin('[name].[hash].css', { disable: !production }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false
      }
    }),
    new FaviconsWebpackPlugin('../assets/icons/favicon.svg')
  );
}

if(test) {
  config.devtool = 'inline-source-map';
} else if(!production) {
  config.devtool = 'eval';
}

module.exports = config;
