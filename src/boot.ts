import db from './lib/db';
import dotenv from 'dotenv';
import auth from './lib/auth';
import NodeCron from 'node-cron';
import StatisticsUtil from 'utils/StatisticsUtil';
import MigrationUtil from 'utils/MigrationUtil';
import Config from 'config';
import { DATA_SET_AMSTERDAM, DATA_SET_ROTTERDAM } from 'models/User';
import InitialDataUtil from 'utils/InitialDataUtil';

class boot {
  static async start(): Promise<Array<any>> {
    console.info('booting...', process.env.ENVIRONMENT);
    dotenv.config();
    Config.assertConfig();
    InitialDataUtil.loadAllTenants();
    StatisticsUtil.registerStatistics(DATA_SET_AMSTERDAM);
    StatisticsUtil.registerStatistics(DATA_SET_ROTTERDAM);
    MigrationUtil.checkRouteProgress();

    // Schedule cron jobs for statistics and data consistency
    NodeCron.schedule('0 12 * * *', async () => {
      console.info('Running statistics cron');
      await StatisticsUtil.registerStatistics(DATA_SET_AMSTERDAM);
      await StatisticsUtil.registerStatistics(DATA_SET_ROTTERDAM);
    });

    NodeCron.schedule('0 5 * * *', async () => {
      console.info('Running route progress cron');
      MigrationUtil.checkRouteProgress();
    });

    // Create admin user
    const items = [await db.connect(), await auth.createAdminUser()];

    return Promise.all(items);
  }
}

export default boot;
