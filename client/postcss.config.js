module.exports = {
  plugins: [
    require(`postcss-import`),
    require(`precss`),
    require(`autoprefixer`)({ browsers: `last 5 versions` }),
  ],
};
