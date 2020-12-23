import gql from 'graphql-tag';

export const AdminUpdateRewardMutation = gql`
  mutation($id: String!, $vouchers: [RewardVoucherInput]) {
    adminUpdateReward(id: $id, vouchers: $vouchers) {
      rewardId
      title
      description
      vouchers {
        id
        userId
        data
      }
    }
  }
`;
