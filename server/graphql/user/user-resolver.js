//1a import model
const { User, validateUser } = require("../../models/user");
//1b
const { GraphQLError } = require("graphql");
//1c
// const { Restaurant } = require("../../models/restaurant");
// //1d
// const { Types } = require("mongoose");
// const { func } = require("joi");
const joi = require("joi");

//2a create resolver
const resolversUser = {
  Query: {
    user: async function (parent, args, context) {
      try {
        isAuthenticated(context);
        const user = await User.findById(args.id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        throw new GraphQLError(`Failed to get user: ${error.message}`, {
          extensions: { code: "GET_USER_ERROR" },
        });
      }
    },
    users: async function (context) {
      try {
        isAuthenticated(context);
        console.log(context.user);
        const users = await User.find();
        return users;
      } catch (error) {
        throw new GraphQLError(`Failed to get users: ${error.message}`, {
          extensions: { code: "GET_USERS_ERROR" },
        });
      }
    },
  },

  Mutation: {
    createUser: async function (parent, args, context) {
      try {
        // const favoriteRestaurantIds = args.input.favoriteRestaurants.map(
        //   (id) => new Types.ObjectId(String(id))
        // );
        const { error, value } = validateUser(args.input);
        if (error) {
          throw new GraphQLError(`Invalid input: ${error.message}`, {
            extensions: { code: "INVALID_USER_INPUT" },
          });
        }

        console.log(context);
        const user = new User({
          username: args.input.username,
          email: args.input.email,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          password: args.input.password,
          favoriteRestaurants: [],
        });
        let token = user.generateAuthToken();
        const newUser = await user.save();
        newUser.token = token;
        return newUser;
      } catch (error) {
        throw new GraphQLError(`Failed to create user: ${error.message}`, {
          extensions: { code: "CREATE_USER_ERROR" },
        });
      }
    },

    loginUser: async function (parent, args) {
      const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
      });

      const { error, value } = loginSchema.validate(args.input);
      if (error) {
        throw new GraphQLError(`Invalid input: ${error.message}`, {
          extensions: { code: "INVALID_USER_INPUT" },
        });
      }

      const user = await User.findOne({ email: args.input.email });

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
          status: 404,
        });
      }
      const validPassword = await user.comparePassword(args.input.password);
      if (!validPassword) {
        throw new GraphQLError("Invalid password", {
          extensions: { code: "INVALID_PASSWORD" },
          status: 401,
        });
      }
      let token = user.generateAuthToken();
      user.token = token;
      return user;
    },

    updateUser: async function (parent, args, context) {
      try {
        isAuthenticated(context);
        //validate data
        const { error, value } = validateUser(args.user);
        if (error) {
          throw new GraphQLError(`Invalid input: ${error.message}`, {
            extensions: { code: "INVALID_USER_INPUT" },
          });
        }
        const user = await User.findById(args.id);
        if (!user) {
          throw new Error("User not found");
        }

        isAuthorized(user, context);
        const updatedUser = await User.findByIdAndUpdate(
          args.id,
          args.input,
          value,
          {
            new: true,
          }
        );
        return updatedUser;
      } catch (error) {
        throw new GraphQLError(`Failed to update user: ${error.message}`, {
          extensions: { code: "UPDATE_USER_ERROR" },
        });
      }
    },

    deleteUser: async function (parent, args, context) {
      try {
        isAuthenticated(context);
        const user = await User.findById(args.id);
        if (!user) {
          throw new Error("User not found");
        }

        isAuthorized(user, context);
        const deletedUser = await User.findByIdAndDelete(args.id);
        return deletedUser;
      } catch (error) {
        throw new GraphQLError(`Failed to delete user: ${error.message}`, {
          extensions: { code: "DELETE_USER_ERROR" },
        });
      }
    },
  },
  // UserType: {
  //   favoriteRestaurants: async (parent) => {
  //     return await Restaurant.find({
  //       _id: { $in: parent.favoriteRestaurants },
  //     });
  //   },
  // },
};

module.exports = resolversUser;

function isAuthenticated(context) {
  if (!context.user) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
      status: 401,
    });
  }
}

function isAuthorized(user, context) {
  if (user._id.toString() !== context.user._id.toString()) {
    throw new GraphQLError("Not authorized", {
      extensions: { code: "NOT_AUTHORIZED" },
      status: 401,
    });
  }
}
