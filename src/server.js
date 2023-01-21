require('dotenv').config();

const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
