const mongoose = require("mongoose");

const Joi = require("joi");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  address: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  cuisine: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  reviews: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  menu: {
    type: [String],
    required: false,
    minlength: 3,
    maxlength: 255,
  },
  currentLocation: {
    currentLocation: { type: String, required: false },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  coordinates: {
    type: [Number],
    required: false,
  },
  schedule: [
    {
      day: { type: String, required: true },
      open: { type: String, required: true },
      close: { type: String, required: true },
    },
  ],
  socialMedia: {
    instagram: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Add the geospatial index on the `coordinates` field
RestaurantSchema.index({ coordinates: "2dsphere" });

function validateRestaurant(restaurant) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(255).required(),
    cuisine: Joi.string().min(3).max(255).required(),
    rating: Joi.number().min(0).max(5).required(),
    reviews: Joi.string().min(3).max(255).required(),
    menu: Joi.array().items(Joi.string().min(3).max(255)).required(),
    // currentLocation: Joi.string().min(3).max(255).required(),
    currentLocation: Joi.object({
      currentLocation: Joi.string().min(3).max(255).required(),
      coordinates: Joi.array().items(Joi.number()).required(),
    }).required(),
    coordinates: Joi.array().required(),
    schedule: Joi.array()
      .items(
        Joi.object({
          day: Joi.string().min(1).max(50).required(),
          open: Joi.string().required(),
          close: Joi.string().required(),
        })
      )
      .optional(),
    socialMedia: Joi.object({
      instagram: Joi.string().min(3).max(255).allow(""),
      facebook: Joi.string().min(3).max(255).allow(""),
      twitter: Joi.string().min(3).max(255).allow(""),
    }).optional(),
    phoneNumber: Joi.string().min(3).max(255).required(),
    user: Joi.string().required(),
  });

  return schema.validate(restaurant);
}

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

// module.exports.Restaurant = Restaurant;

// module.exports.validate = validateRestaurant;

// Export the model and validation function
module.exports = {
  Restaurant,
  validateRestaurant,
};
