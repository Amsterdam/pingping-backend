import createServer from './server';
import express from 'express';
import boot from './boot';

boot.start();
const server = createServer();

const corsOptions: object = {
  credentials: true,
  origin: process.env.APP_URL,
};

server.use(express.static('public'));

server.get('/status/health', (req, res) => {
  res.send('OK');
});

server.listen(
  {
    port: process.env.PORT || 4000,
    cors: corsOptions,
    playground: process.env.NODE_ENV === 'production' ? false : '/api',
  },
  () => {
    console.log(`Server started: ${process.env.PORT || 4000}`);
    return server;
  }
);

export default server;
