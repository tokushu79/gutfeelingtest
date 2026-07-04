// PM2 process manager config for running the production server.
// Usage (from the server/ directory, after `npm run build`):
//   pm2 start ecosystem.config.cjs
//   pm2 save
//   pm2 startup   (then run the command it prints, so it survives reboots)
module.exports = {
  apps: [
    {
      name: "gutfeelingtest-api",
      script: "dist/index.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      watch: false,
    },
  ],
};
