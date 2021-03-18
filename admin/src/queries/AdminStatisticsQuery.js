import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query {
    adminStatistics {
      usersPerWeek {
        values
        keys
      }
      usersAccumulative {
        values
        keys
      }
      activeUsers {
        current
        change
      }
      totalUsers {
        current
        change
      }
      skippedOnboarding {
        current
        change
        percentile
      }
      routes {
        title
        data {
          values
          keys
        }
      }
    }
  }
`;
