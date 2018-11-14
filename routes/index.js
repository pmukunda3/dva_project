module.exports = server => {
  server.route({
    method: 'GET',
    path: '/build/{filepath*}',
    config: {
      handler: {
        directory: {
          path: 'public/build/',
          listing: false,
          index: false
        }
      }
    }
  });

  require('./api')(server);

  server.route({
    method: 'GET',
    path: '/health',
    config: {
      handler: (request, h) => {
        return 'OK';
      }
    }
  });

  server.route({
    method: ['GET', 'POST'],
    path: '/{path*}',
    config: {
      handler: {
        file: 'public/index.html'
      }
    }
  });
};
