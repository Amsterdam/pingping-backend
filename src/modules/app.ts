import { GraphQLModule } from "@graphql-modules/core";

import { CommonModule } from "./common";
import { RewardsModule } from "./rewards";
import { AuthModule } from './auth';

export const AppModule = new GraphQLModule({
    imports: ({ config: { rewards, routes} }) => [
        CommonModule.forRoot({
            rewards,
            // routes,
        }),
        AuthModule,
        RewardsModule,
    ],
    configRequired: true,
});
