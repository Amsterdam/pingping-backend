import gql from 'graphql-tag';

export const GetUsersQuery = gql`
  query {
    getUsers {
      id
      createdAt
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
