import gql from 'graphql-tag';

export const GetDraftNotificationQuery = gql`
  query($type:NotificationType!, $routeId:String) {
    getDraftNotification(type:$type, routeId:$routeId) {
      title
      payload
      recipientUserIds
    }
  }
`;
