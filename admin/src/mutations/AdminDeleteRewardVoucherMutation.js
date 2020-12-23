import gql from 'graphql-tag';

export const AdminDeleteRewardVoucherMutation = gql`
  mutation($id: String!) {
    adminDeleteRewardVoucher(id: $id) {
      message
    }
  }
`;
