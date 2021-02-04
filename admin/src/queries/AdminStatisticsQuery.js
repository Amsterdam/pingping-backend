import gql from 'graphql-tag';

export const AdminStatisticsQuery = gql`
  query($week:String) {
    adminStatistics(week:$week) {
      usersPerDay {
        values
        keys
      }
      completedTasks {
        values
        keys
      }
      usersPerYearOfBirth {
        dump
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
