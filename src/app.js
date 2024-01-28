const container = require('./Infrastructures/container');
const createServer = require('./Infrastructures/http/createServer');

require('dotenv').config();

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
