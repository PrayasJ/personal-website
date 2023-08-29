const path = require('path')
 
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader', // Use the 'raw-loader' to read the raw content of the Markdown file as a string
    });
    return config;
  },
}