import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query {
    adminStatistics {
      activeUsersPerWeek {
        values
        keys
      }
      usersPerWeek {
        values
        keys
      }
      usersCumulative {
        values
        keys
      }
      routesPerMonth {
        values
        keys
      }
      routesCompletedPerMonth {
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
