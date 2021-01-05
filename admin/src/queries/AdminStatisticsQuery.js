import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query {
    adminStatistics {
      usersPerDay
    }
  }
`;
