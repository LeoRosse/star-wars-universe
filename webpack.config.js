const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;
module.exports = (_, argv) => ({
  entry: './src/index',
  output: {
    publicPath: argv.mode === 'development' ? 'http://localhost:3000/' : 'start-wars-universe.vercel.app',
    path: path.resolve(__dirname, './build'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    port: 3000,
    stats: 'normal',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'universe',
      filename: 'remoteEntry.js',
      remotes: {
        characters: 'characters@http://localhost:3001/remoteEntry.js',
        planets: 'planets@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        './Navigation': './src/components/navigation',
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
});
