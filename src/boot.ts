import db from './lib/db';
import dotenv from 'dotenv';
import auth from './lib/auth';
import NodeCron from 'node-cron';
import StatisticsUtil from 'utils/StatisticsUtil';
import MigrationUtil from 'utils/MigrationUtil';
import Config from 'config';

class boot {
  static async start(): Promise<Array<any>> {
    console.log('booting...', process.env.ENVIRONMENT);
    dotenv.config();
    Config.assertConfig();
    StatisticsUtil.registerStatistics();
    MigrationUtil.checkRouteProgress();

    // Schedule cron jobs for statistics and data consistency
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
