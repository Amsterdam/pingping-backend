import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query {
    adminStatistics {
      usersPerDay
      completedTasks
      activeUsers {
        current
        change
      }
      totalUsers {
        current
        change
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
