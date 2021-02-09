import gql from 'graphql-tag';

export const GetUsersQuery = gql`
  query($role: UserRole!) {
    adminGetUsers(role:$role) {
      id
      createdAt
      activeAt
      profile {
        fullName
      }
      devices {
        id
        token
        os
        notificationStatus
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
