import gql from 'graphql-tag';

export const GetNotificationsQuery = gql`
  query {
    getNotifications {
      id
      createdAt
      status
      type
    }
  }
`;
