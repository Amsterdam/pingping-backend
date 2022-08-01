import db from './lib/db';
import dotenv from 'dotenv';
import auth from './lib/auth';
import NodeCron from 'node-cron';
import StatisticsUtil from 'utils/StatisticsUtil';
import MigrationUtil from 'utils/MigrationUtil';
import Config from 'config';
import InitialDataUtil, { TENANTS } from 'utils/InitialDataUtil';

class boot {
  static async start(): Promise<Array<any>> {
    console.info('booting...', process.env.ENVIRONMENT);
    dotenv.config();
    Config.assertConfig();
    InitialDataUtil.loadAllTenants();
    for (const tenant of TENANTS) {
      console.info('register statistics for tenant:', tenant);
      StatisticsUtil.registerStatistics(tenant);
    }
    MigrationUtil.checkRouteProgress();

    // Schedule cron jobs for statistics and data consistency
    NodeCron.schedule('0 12 * * *', async () => {
      console.info('Running statistics cron');
      for (const tenant of TENANTS) {
        console.info('register statistics cronjob for tenant:', tenant);
        await StatisticsUtil.registerStatistics(tenant);
      }
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
