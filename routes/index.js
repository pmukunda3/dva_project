module.exports = server => {
  // server.route({
  //   method: 'GET',
  //   path: '/public/{filepath*}',
  //   config: {
  //     handler: {
  //       directory: {
  //         path: 'public/lib/',
  //         listing: false,
  //         index: false
  //       }
  //     }
  //   }
  // });
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
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

  // server.route({
  //   method: ['GET', 'POST'],
  //   path: '/{path*}',
  //   config: {
  //     handler: {
  //       file: 'public/index.html'
  //     }
  //   }
  // });
};
