import gql from 'graphql-tag';

export const AdminSendNotificationsMutation = gql`
  mutation($input: SendNotificationInput!) {
    adminSendNotifications(input: $input)
  }
`;
