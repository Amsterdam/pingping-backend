import Query from './Query';
import Mutation from './Mutation';
import { IResolvers } from '../generated/graphql';

const resolvers:IResolvers  = {
  Query,
  Mutation
}

export default resolvers;

