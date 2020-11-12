import gql from 'graphql-tag';

export const GetAuditLogQuery = gql`
  query {
    adminGetAuditLog {
      user {
        profile {
          fullName
        }
      }
      type
      createdAt
      description
    }
  }
`;
