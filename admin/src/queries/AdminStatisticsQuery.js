import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query {
    adminStatistics {
      usersPerDay
      completedTasks
      activeUsers30Days
    }
  }
`;
