/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      name: 'forum-api',
      script: 'npm',
      args: 'run start', // or point directly to your build folder, e.g., 'dist/index.js'
      instances: 1, // Set to 'max' to utilize all CPU cores
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001
      }
    }
  ]
};