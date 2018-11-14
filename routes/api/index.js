module.exports = function(server) {
  require('./get_data')(server);

  server.route({
    method: ['GET', 'POST'],
    path: '/api/{path*}',
    config: {
      handler: (request, h) => {
        return request.params.path + ' does not exist';
      }
    }
  });
};
