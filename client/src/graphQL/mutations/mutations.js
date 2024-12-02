import { gql } from "@apollo/client";

export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($input: RestaurantInput!) {
    createRestaurant(input: $input) {
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
      userId
    }
  }
`;

export const UPDATE_RESTAURANT_LOCATION = gql`
  mutation UpdateRestaurantLocation(
    $id: ID!
    $latitude: Float!
    $longitude: Float!
  ) {
    updateRestaurantLocation(
      id: $id
      latitude: $latitude
      longitude: $longitude
    ) {
      id
      coordinates
    }
  }
`;

export const UPDATE_RESTAURANT_SCHEDULE = gql`
  mutation UpdateRestaurantSchedule(
    $id: ID!
    $operatingHours: [OperatingHoursInput!]
  ) {
    updateRestaurantSchedule(id: $id, operatingHours: $operatingHours) {
      id
      schedule {
        day
        open
        close
      }
    }
  }
`;

export const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant(
    $updateRestaurantId: ID!
    $input: RestaurantUpdateInput!
  ) {
    updateRestaurant(id: $updateRestaurantId, input: $input) {
      id
      name
      address
      cuisine
      rating
      reviews
      phoneNumber
    }
  }
`;

export const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($id: ID!) {
    deleteRestaurant(id: $id) {
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
      userId
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      username
      email
      firstName
      lastName
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      id
      username
      email
      firstName
      lastName
      token
    }
  }
`;
