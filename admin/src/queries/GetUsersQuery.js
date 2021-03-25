import gql from 'graphql-tag';

export const GetUsersQuery = gql`
  query($roles: [UserRole!]) {
    adminGetUsers(roles:$roles) {
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
        status
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
