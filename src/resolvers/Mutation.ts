import PingPingMutations from './PingPingMutations'
import { MutationResolvers } from '../generated/graphql';

const Mutation:MutationResolvers = {
  ...PingPingMutations
};
export default Mutation;
