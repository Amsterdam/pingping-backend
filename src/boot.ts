import db from './lib/db';
import dotenv from 'dotenv';

class boot {
  static async start() {
    console.log('booting...', process.env.NODE_ENV);
    require('console-stamp')(console, '[HH:MM:ss.l]');
    dotenv.config();

    const items = [await db.connect()];

    return Promise.all(items);
  }
}

export default boot;
