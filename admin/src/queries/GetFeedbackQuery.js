import gql from 'graphql-tag';

export const GetFeedbackQuery = gql`
  query {
    adminGetFeedback {
      rating
      routeId
      feedback
      createdAt
    }
  }
`;
