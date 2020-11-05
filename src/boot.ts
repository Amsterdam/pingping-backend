import db from './lib/db';
import dotenv from 'dotenv';
import auth from './lib/auth';

class boot {
  static async start() {
    console.log('booting...', process.env.NODE_ENV);
    require('console-stamp')(console, '[HH:MM:ss.l]');
    dotenv.config();

    // Create admin user
    const items = [await db.connect(), await auth.createAdminUser()];

    return Promise.all(items);
  }
}

export default boot;
