import 'reflect-metadata';
import App from './App';

const corsOptions: object = {
  credentials: true,
  origin: process.env.APP_URL,
};

App.listen(
  {
    cors: corsOptions,
    port: process.env.PORT || 4000,
    playground: process.env.NODE_ENV === 'production' ? false : '/api',
  },
  () => {
    console.log(`Server started: ${process.env.PORT || 4000}`);
  }
);
