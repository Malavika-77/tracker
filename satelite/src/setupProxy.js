const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/satellite', // Specify the route to be proxied
    createProxyMiddleware({
      target: 'http://localhost:10000', // Specify the URL of your backend server
      changeOrigin: true,
    })
  );
};
