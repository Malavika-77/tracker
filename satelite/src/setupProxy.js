const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/satellite', // Specify the route to be proxied
    createProxyMiddleware({
      target: 'https://tracker-hxvn.onrender.com', // Specify the URL of your backend server
      changeOrigin: true,
    })
  );
};
