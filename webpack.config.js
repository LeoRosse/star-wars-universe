const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;

const libraryName = 'star-wars-universe';

const reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom',
};

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const common = (pathDomain) => {
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
    externals: {
      react: reactExternal,
      'react-dom': reactDOMExternal,
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

const developmentConfig = (mode) => {
  const pathDomain = mode === 'development' ? 'http://localhost:3000/' : 'https://star-wars-universe.vercel.app';
  return {
    ...common(pathDomain),
    target: 'node',
    output: {
      path: path.resolve(__dirname, './build'),
      publicPath: pathDomain,
      filename: 'main.js',
      library: libraryName,
      libraryTarget: 'commonjs2',
    },
  };
};

module.exports = (_, argv) => {
  if (argv.mode === 'production')
    return {
      ...developmentConfig(argv.mode),
    };
  return { ...developmentConfig(argv.mode) };
};
