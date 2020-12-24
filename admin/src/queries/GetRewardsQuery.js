import gql from 'graphql-tag';

export const GetRewardsQuery = gql`
  query rewards {
    getRewards {
      rewardId
      title
      description
      active
      status
      vouchers {
        id
        userId
        data
      }
    }
  }
`;
