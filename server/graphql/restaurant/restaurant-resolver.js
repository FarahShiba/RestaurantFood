const { Restaurant, validateRestaurant } = require("../../models/restaurant");
const { User } = require("../../models/user");
const { GraphQLError } = require("graphql");

const resolversRestaurant = {
  Query: {
    restaurant: async function (parent, args, context) {
      try {
        isAuthenticated(context);
        const restaurant = await Restaurant.findById(args.id);
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }
        restaurant.userId = restaurant.user;
        return restaurant;
      } catch (error) {
        throw new GraphQLError(`Failed to get restaurant: ${error.message}`, {
          extensions: { code: "GET_RESTAURANT_ERROR" },
        });
      }
    },

    restaurants: async function (parent, args, context) {
      console.log("restaurants");
      try {
        isAuthenticated(context);
        const restaurants = await Restaurant.find();
        return restaurants;
      } catch (error) {
        throw new GraphQLError(`Failed to get restaurants: ${error.message}`, {
          extensions: { code: "GET_RESTAURANTS_ERROR" },
        });
      }
    },

    searchRestaurants: async function (parent, args) {
      try {
        const { cuisine, minRating, maxRating } = args;
        const restaurants = await Restaurant.find({
          cuisine: cuisine,
          rating: { $gte: minRating, $lte: maxRating },
        });
        return restaurants;
      } catch (error) {
        throw new GraphQLError(
          `Failed to search restaurants: ${error.message}`,
          {
            extensions: { code: "SEARCH_RESTAURANTS_ERROR" },
          }
        );
      }
    },
    getNearbyRestaurants: async function (parent, args) {
      try {
        const { latitude, longitude, radius } = args;
        const nearbyRestaurants = await Restaurant.find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], radius / 6378.1],
            },
          },
        });

        return nearbyRestaurants;
      } catch (error) {
        throw new GraphQLError(
          `Failed to get nearby restaurants: ${error.message}`,
          {
            extensions: { code: "GET_NEARBY_RESTAURANTS_ERROR" },
          }
        );
      }
    },
  },

  Mutation: {
    createRestaurant: async function (parent, args, context) {
      try {
        isAuthenticated(context);

        const { error } = validateRestaurant({
          ...args.input,
          user: args.input.userId,
        });
        console.log(args.input);
        const user = await User.findById(args.input.userId);
        console.log(user);
        if (!user) {
          throw new Error("User not found");
        }

        const restaurant = new Restaurant({
          name: args.input.name,
          address: args.input.address,
          cuisine: args.input.cuisine,
          rating: args.input.rating,
          reviews: args.input.reviews,
          menu: args.input.menu,
          currentLocation: {
            currentLocation: args.input.currentLocation.currentLocation,
            coordinates: args.input.currentLocation.coordinates,
          },
          coordinates: args.input.coordinates,
          schedule: args.input.schedule,
          socialMedia: args.input.socialMedia,
          phoneNumber: args.input.phoneNumber,
          user: args.input.userId,
        });

        const savedRestaurant = await restaurant.save();

        return {
          id: savedRestaurant._id,
          name: savedRestaurant.name,
          address: savedRestaurant.address,
          cuisine: savedRestaurant.cuisine,
          rating: savedRestaurant.rating,
          reviews: savedRestaurant.reviews,
          menu: savedRestaurant.menu,
          currentLocation: savedRestaurant.currentLocation,
          coordinates: savedRestaurant.coordinates,
          schedule: savedRestaurant.schedule,
          socialMedia: savedRestaurant.socialMedia,
          phoneNumber: savedRestaurant.phoneNumber,
          userId: args.input.userId,
        };
      } catch (error) {
        throw new GraphQLError(
          `Failed to create restaurant: ${error.message}`,
          {
            extensions: { code: "CREATE_RESTAURANT_ERROR" },
          }
        );
      }
    },

    updateRestaurant: async (parent, args, context) => {
      console.log("Context User:", context.user); // Check context user
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the restaurant to update by its ID
        const restaurant = await Restaurant.findById(args.id);
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        // Check if the user is authorized to edit the restaurant
        isAuthorized(restaurant, context);
        // Update the restaurant with the input data
        restaurant.name = args.input.name;
        restaurant.address = args.input.address;
        restaurant.cuisine = args.input.cuisine;
        restaurant.rating = args.input.rating;
        restaurant.reviews = args.input.reviews;
        restaurant.menu = args.input.menu;
        restaurant.currentLocation = args.input.currentLocation;
        restaurant.coordinates = args.input.coordinates;
        restaurant.schedule = args.input.schedule;
        restaurant.socialMedia = args.input.socialMedia;
        restaurant.phoneNumber = args.input.phoneNumber;
        restaurant.userId = args.input.userId;
        return await restaurant.save();
      } catch (error) {
        throw new GraphQLError(
          `Failed to update restaurant: ${error.message}`,
          {
            extensions: { code: "UPDATE_RESTAURANT_ERROR" },
          }
        );
      }
    },

    updateRestaurantLocation: async function (parent, args, context) {
      try {
        isAuthenticated(context);
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
          args.id,
          { coordinates: [args.latitude, args.longitude] },
          { new: true }
        );
        if (!updatedRestaurant) {
          throw new Error("Restaurant not found");
        }
        return updatedRestaurant;
      } catch (error) {
        throw new GraphQLError(
          `Failed to update restaurant location: ${error.message}`,
          {
            extensions: { code: "UPDATE_RESTAURANT_LOCATION_ERROR" },
          }
        );
      }
    },

    deleteRestaurant: async (parent, args, context) => {
      try {
        isAuthenticated(context);

        // Find the restaurant by ID
        const restaurant = await Restaurant.findByIdAndDelete(args.id);
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        // Ensure the user is authorized
        isAuthorized(restaurant, context);

        // Delete the restaurant
        await Restaurant.deleteOne({ _id: args.id });

        // Return the deleted restaurant details
        restaurant.userId = restaurant.user;
        return restaurant;
      } catch (error) {
        throw new GraphQLError(
          `Failed to delete restaurant: ${error.message}`,
          {
            extensions: { code: "DELETE_RESTAURANT_ERROR" },
          }
        );
      }
    },

    updateRestaurantSchedule: async function (parent, args, context) {
      try {
        isAuthenticated(context);
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
          args.id,
          { schedule: args.operatingHours },
          { new: true }
        );
        if (!updatedRestaurant) {
          throw new Error("Restaurant not found");
        }
        return updatedRestaurant;
      } catch (error) {
        throw new GraphQLError(
          `Failed to update restaurant schedule: ${error.message}`,
          {
            extensions: { code: "UPDATE_RESTAURANT_SCHEDULE_ERROR" },
          }
        );
      }
    },
  },
};

function isAuthenticated(context) {
  if (!context.user) {
    throw new GraphQLError("User is not authenticated, No token provided", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
}

function isAuthorized(restaurant, context) {
  if (!restaurant.user || restaurant.user.toString() !== context.user._id) {
    throw new GraphQLError("User is not authorized to perform this action", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }
}

module.exports = resolversRestaurant;
