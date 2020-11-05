import gql from 'graphql-tag';

export const DeleteUserMutation = gql`
  mutation($id: String!) {
    adminDeleteUser(id: $id)
  }
`;
