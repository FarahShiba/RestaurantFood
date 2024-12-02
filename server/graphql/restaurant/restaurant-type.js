const gql = require("graphql-tag");

const typeDefsRestaurant = gql`
  type RestaurantType {
    id: ID!
    name: String!
    address: String!
    cuisine: String!
    rating: Float!
    reviews: String
    menu: [String]
    currentLocation: LocationType
    coordinates: [Float]
    schedule: [OperatingHoursType]
    socialMedia: SocialMediaType
    phoneNumber: String
    userId: ID!
  }

  type LocationType {
    currentLocation: String
    coordinates: [Float]
  }

  type OperatingHoursType {
    day: String!
    open: String!
    close: String!
  }

  type SocialMediaType {
    facebook: String
    twitter: String
    instagram: String
  }

  input RestaurantInput {
    name: String!
    address: String!
    cuisine: String!
    rating: Float!
    reviews: String!
    menu: [String]
    currentLocation: LocationInput!
    coordinates: [Float]
    schedule: [OperatingHoursInput]
    socialMedia: SocialMediaInput!
    phoneNumber: String!
    userId: ID!
  }

  input RestaurantUpdateInput {
    name: String!
    address: String!
    cuisine: String!
    rating: Float!
    reviews: String!
    menu: [String]
    currentLocation: LocationInput
    coordinates: [Float]
    schedule: [OperatingHoursInput]
    socialMedia: SocialMediaInput
    phoneNumber: String!
    userId: ID!
  }

  input LocationInput {
    currentLocation: String!
    coordinates: [Float]
  }

  input OperatingHoursInput {
    day: String!
    open: String!
    close: String!
  }

  input SocialMediaInput {
    facebook: String
    twitter: String
    instagram: String
  }

  input SearchRestaurantInput {
    cuisine: String
    currentLocation: LocationInput
    minRating: Float
    maxRating: Float
  }

  type Query {
    restaurant(id: ID!): RestaurantType
    restaurants: [RestaurantType]
    searchRestaurants(
      cuisine: String
      minRating: Float
      maxRating: Float
    ): [RestaurantType]
    getNearbyRestaurants(
      latitude: Float!
      longitude: Float!
      radius: Int!
    ): [RestaurantType]
  }

  type Mutation {
    createRestaurant(input: RestaurantInput!): RestaurantType
    updateRestaurantLocation(
      id: ID!
      latitude: Float!
      longitude: Float!
    ): RestaurantType
    updateRestaurantSchedule(
      id: ID!
      operatingHours: [OperatingHoursInput!]
    ): RestaurantType
    updateRestaurant(id: ID!, input: RestaurantUpdateInput!): RestaurantType
    deleteRestaurant(id: ID!): RestaurantType
  }
`;

module.exports = typeDefsRestaurant;
