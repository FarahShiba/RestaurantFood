import { gql } from "@apollo/client";

// Query to fetch all restaurants
export const GET_RESTAURANTS = gql`
  query Restaurants {
    restaurants {
      id
      name
      address
      cuisine
      rating
      reviews
      menu
      currentLocation {
        currentLocation
        coordinates
      }
      coordinates
      schedule {
        day
        open
        close
      }
      socialMedia {
        facebook
        twitter
        instagram
      }
      phoneNumber
    }
  }
`;

// Query to fetch a single restaurant by ID
export const GET_RESTAURANT = gql`
  query Query($restaurantId: ID!) {
    restaurant(id: $restaurantId) {
      id
      name
      address
      cuisine
      rating
      reviews
      menu

      coordinates

      phoneNumber
      userId
    }
  }
`;
