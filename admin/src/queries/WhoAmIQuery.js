import gql from 'graphql-tag';

export const WhoAmIQuery = gql`
  query {
    whoAmI {
      role
      dataSet
      profile {
        fullName
      }
    }
    getEnv
  }
`;
