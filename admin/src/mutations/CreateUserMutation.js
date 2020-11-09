import gql from 'graphql-tag';

export const CreateUserMutation = gql`
  mutation($input: CreateUserInput!) {
    adminCreateUser(input: $input) {
      id
    }
  }
`;
