const { resolve } = require(`path`);
const webpack = require(`webpack`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === `development`;

const entry = {
  app: [resolve(__dirname, `./src/index.jsx`)],
};

const output = {
  path: resolve(__dirname, `./dist/`),
  filename: isDevelopment ?
    `assets/[name]-[hash].js` : `assets/[name]-[chunkhash].js`,
  publicPath: `/`,
};

const plugins = {
  common: [
    new webpack.optimize.CommonsChunkPlugin({
      name: `vendor`,
      minChunks: (module) => {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf(`node_modules`) !== -1;
      },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: `production` }),
    new webpack.DefinePlugin({
      IS_DEVELOPMENT: JSON.stringify(isDevelopment),
      API: JSON.stringify(process.env.API_URI),
    }),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `./src/index.ejs`,
      inject: `body`,
      cache: true,
      minify: !isDevelopment && {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
      },
    }),
    new SWPrecacheWebpackPlugin(
      {
        filename: `service-worker-precache.js`,
        mergeStaticsConfig: true,
        minify: true,
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),
  ],

  development: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],

  production: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: { comments: false },
      warnings: false,
      compress: { drop_console: true },
      sourceMap: true,
    }),
    new ExtractTextPlugin(`assets/styles-[contenthash].css`),
  ],
};

const rules = {
  common: [{
    test: /\.jsx?$/,
    use: `babel-loader`,
    include: resolve(__dirname, `./src/`),
    exclude: /(node_modules|bower_components)/,
  }, {
    test: /\.svg$/,
    loader: `svg-inline-loader`,
  }],

  development: [{
    test: /\.css$/,
    loader: `style-loader!` +
            `css-loader?localIdentName=[name]_[local]-[hash:base64:5]&modules=true!` +
            `postcss-loader`,
  }, {
    test: /\.(png|jpg|jpeg|gif)$/,
    loader: `url-loader?limit=25000&name=assets/images/[name]-[hash].[ext]`,
  }],

  production: [{
    test: /\.css$/,
    use: ExtractTextPlugin.extract([
      {
        loader: `css-loader`,
        options: {
          importLoaders: 1,
          minimize: true,
          modules: true,
        },
      },
      `postcss-loader`,
    ]),
  }, {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [{
      loader: `url-loader`,
      options: {
        limit: 25000,
        name: `assets/images/[name]-[hash].[ext]`,
      },
    }, {
      loader: `image-webpack-loader`,
      options: {
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
        },
        progressive: true,
        optipng: {
          optimizationLevel: 6,
        },
        gifsicle: {
          interlaced: true,
          optimizationLevel: 3,
        },
      },
    }],
  }],
};

const devServer = {
  host: process.env.DEV_HOST || `0.0.0.0`,
  port: process.env.DEV_PORT || 3001,
  contentBase: `dist/`,
  hot: true,
  // disableHostCheck: true,
  stats: { colors: true },
  historyApiFallback: true,
};

module.exports = {
  devtool:
    process.env.DEVTOOL ||
    isDevelopment ? `cheap-module-source-map` : `source-map`,
  entry: isDevelopment ? {
    ...entry,
    app: [
      `webpack-dev-server/client?http://localhost:${devServer.port}/`,
      `webpack/hot/only-dev-server`,
      ...entry.app,
    ],
  } : entry,
  output,
  resolve: {
    extensions: [`.js`, `.jsx`],
  },
  plugins: isDevelopment ?
    [...plugins.common, ...plugins.development] :
    [...plugins.common, ...plugins.production],
  module: {
    rules: isDevelopment ?
      [...rules.common, ...rules.development] :
      [...rules.common, ...rules.production],
  },
  devServer,
};
