const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  );

  // Añadir esta configuración para el servidor de desarrollo
  if (config.devServer) {
    config.devServer = {
      ...config.devServer,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        // Aquí puedes añadir tus propios middlewares si los necesitas

        return middlewares;
      },
    };
  }

  return config;
};