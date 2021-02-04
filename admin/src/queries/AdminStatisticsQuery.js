import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query {
    adminStatistics {
      usersPerDay {
        values
        keys
      }
      completedTasks {
        values
        keys
      }
      usersPerYearOfBirth {
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
