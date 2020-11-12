import gql from 'graphql-tag';

export const GetUsersQuery = gql`
  query {
    adminGetUsers {
      id
      createdAt
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
