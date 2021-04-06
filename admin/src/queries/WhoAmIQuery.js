import gql from 'graphql-tag';

export const WhoAmIQuery = gql`
  query {
    whoAmI {
      role
      profile {
        fullName
      }
    }
    getEnv
  }
`;
