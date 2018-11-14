const Hapi = require('Hapi');
const inert = require('inert');

// asynce is needed for all functions with asynchronous calls
async function init_server() {
  let conn = {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000
  };

  // initialize server
  const server = new Hapi.server(conn);

  // all async calls needs await keyword
  await server.register(inert);

  // get all server routes
  await require('./routes')(server);

  // Start the server
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init_server();

process.on('unhandledRejection', e => {
  console.log(e);
});
