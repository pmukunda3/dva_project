module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/api/getdata',
    config: {
      handler: (request, h) => {
        return 'getting data now...';
      }
    }
  });
};
