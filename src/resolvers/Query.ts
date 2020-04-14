import PingPingQueries from './PingPingQueries';
import { QueryResolvers } from '../generated/graphql';

const Query:QueryResolvers = {
  ...PingPingQueries,
}
export default Query
