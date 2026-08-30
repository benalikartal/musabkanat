module.exports = {
  apps: [
    {
      name: 'musabkanat-backend',
      script: 'backend/src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M'
    }
  ]
};
