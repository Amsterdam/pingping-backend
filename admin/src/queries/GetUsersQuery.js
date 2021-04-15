import gql from 'graphql-tag';

export const GetUsersQuery = gql`
  query($roles: [UserRole!], $filter: UserFilter) {
    adminGetUsers(roles:$roles, filter:$filter) {
      id
      createdAt
      activeAt
      role
      email
      profile {
        fullName
      }
      devices {
        id
        token
        os
        notificationStatus
      }
      balance
      routes {
        routeId
        status
        completedAt
      }
      userTasks {
        status
        task {
          taskId
          title
        }
        answer
      }
      rewards
      transactions
    }
  }
`;
