const path = require('path');

module.exports = {
  webpack: (config, { defaultLoaders }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@repo/pimwrap': path.resolve(__dirname, '../../packages/pimwrap'),
      '@repo/zerowrap': path.resolve(__dirname, '../../packages/zerowrap'),
    };

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [
        path.resolve(__dirname, '../../packages/pimwrap'),
        path.resolve(__dirname, '../../packages/zerowrap'),
      ],
      use: [defaultLoaders.babel],
    });

    return config;
  },
};