import gql from 'graphql-tag';

export const GetRewardsQuery = gql`
  query rewards {
    getRewards {
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
