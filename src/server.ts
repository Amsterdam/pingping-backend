import { GraphQLServer } from "graphql-yoga";
import resolvers from "./resolvers/Resolvers";
import _ from 'lodash'
import auth from './lib/auth';
import Context from "./resolvers/Context";

const typeDefs = "./src/schema.graphql";

const context = async ({ request }: any):Promise<Context> => {
  const accessToken = _.get(request, "headers.authorization", null);
  const user = accessToken ? await auth.getUser(accessToken) : null;

  return { req: request, user, accessToken } as Context;
};

function createServer() {
  return new GraphQLServer({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context
  });
}

export default createServer;
