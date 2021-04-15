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
        createdAt(format: "DD.MM.YYYY HH:mm")
        completedAt(format: "DD.MM.YYYY HH:mm")
      }
      userTasks {
        status
        createdAt
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
