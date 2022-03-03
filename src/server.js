const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: process.env.NODE_ENV === 'development' ? 'localhost' : '',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan di port ${server.info.port}`);
};

process.on('unhandledRejection', (e) => {
  console.log(e);
  process.exit(1);
});

init();
