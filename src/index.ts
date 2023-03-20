import createServer from './server';
import boot from './boot';

process.env.NODE_ENV = 'production';

boot.start();
const server = createServer();

const corsOptions: object = {
  credentials: true,
  origin: process.env.APP_URL,
};

server.get('/status/health', (req, res) => {
  res.send('OK');
});

server.listen(
  {
    port: process.env.PORT || 4000,
    cors: corsOptions,
  },
  () => {
    console.info(`Server started: ${process.env.PORT || 4000}`);
    return server;
  }
);

export default server;
