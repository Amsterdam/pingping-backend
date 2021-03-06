import { GraphQLModule } from '@graphql-modules/core';

import { CommonModule } from './common';
import { RewardsModule } from './rewards';
import { AdminModule } from './admin';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { RoutesModule } from './routes';

export const AppModule = new GraphQLModule({
  imports: ({ config: { rewards, routes } }) => [
    CommonModule.forRoot({
      rewards,
      routes,
    }),
    AdminModule,
    AuthModule,
    UserModule,
    RoutesModule,
    RewardsModule,
  ],
  configRequired: true,
});
