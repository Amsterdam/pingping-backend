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
