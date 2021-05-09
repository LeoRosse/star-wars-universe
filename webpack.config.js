const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;
module.exports = (_, argv) => {
  const pathDomain = argv.mode === 'development' ? 'http://localhost:3000/' : 'https://start-wars-universe.vercel.app';
  return {
    entry: './src/index',
    output: {
      publicPath: pathDomain,
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
          characters: `characters@${pathDomain}/remoteEntry.js`,
          planets: `planets@${pathDomain}/remoteEntry.js`,
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
  };
};
