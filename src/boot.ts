import db from './lib/db';
import dotenv from 'dotenv';
import auth from './lib/auth';
import NodeCron from 'node-cron';
import StatisticsUtil from 'utils/StatisticsUtil';
import MigrationUtil from 'utils/MigrationUtil';

class boot {
  static async start() {
    console.log('booting...', process.env.NODE_ENV);
    require('console-stamp')(console, '[HH:MM:ss.l]');
    dotenv.config();
    StatisticsUtil.registerStatistics();
    MigrationUtil.checkRouteProgress();

    NodeCron.schedule('0 12 * * *', async () => {
      console.log('Running statistics cron');
      await StatisticsUtil.registerStatistics();
    });

    NodeCron.schedule('0 5 * * *', async () => {
      console.log('Running route progress cron');
      MigrationUtil.checkRouteProgress();
    });

    // Create admin user
    const items = [await db.connect(), await auth.createAdminUser()];

    return Promise.all(items);
  }
}

export default boot;
