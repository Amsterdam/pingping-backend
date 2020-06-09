import 'reflect-metadata';
import { AppModule } from 'modules/app';

// Ask for typeDefs without all schema with business logic
export default AppModule.forRoot({ rewards: [], messages: [] }).typeDefs;
