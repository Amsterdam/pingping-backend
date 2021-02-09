import gql from 'graphql-tag';

export const AdminStatisticsWeeklyQuery = gql`
  query($week:String) {
    adminStatistics(week:$week) {
      completedTasks {
        values
        keys
      }
      usersPerYearOfBirth {
        values
        keys
      }
      userPerMonthOfBirthFocus {
        values
        keys
      }
    }
  }
`;
