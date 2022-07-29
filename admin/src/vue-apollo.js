import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { setContext } from '@apollo/client/link/context';
// import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = 'pp:token';

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || '../api';

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: httpEndpoint
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});


// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})