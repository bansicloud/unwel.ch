import gql from 'graphql-tag'

export const BET_INFO = gql`
  query($betId: String!) {
    bet(id: $betId) {
      id
      quantity
      user {
        id
        name
        avatar
      }
      user2 {
        id
        name
        avatar
      }
      userResponse
      user2Response
      statement {
        statement
        user {
          id
          name
        }
      }
      createdAt
    }
    currentUser {
      id
    }
  }
`
