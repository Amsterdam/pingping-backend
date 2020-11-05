import gql from 'graphql-tag';

export const GetAuditLogQuery = gql`
  query {
    getAuditLog {
      user {
        profile {
          fullName
        }
      }
      type
      description
    }
  }
`;
