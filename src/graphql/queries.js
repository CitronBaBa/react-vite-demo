import { gql } from '@apollo/client';

export const GET_COUNTRY_EMOJI = gql`
  query GetCountryEmoji($code: ID!) {
    country(code: $code) {
      emoji
    }
  }
`;

export const GET_ALL_COUNTRIES = gql`
  query {
    countries {
      code
      name
    }
  }
`;