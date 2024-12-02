//1a
const mongoose = require("mongoose");
//1e
const Joi = require("joi");

//1f
const bcrypt = require("bcrypt");

//1h
const jwt = require("jsonwebtoken");

//1j
const config = require("config");

//1b
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 255,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: "Invalid email address",
    },
  },
  firstName: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 255,
  },

  lastName: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 255,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },

  favoriteRestaurants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  ],
});

//1d
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(255).required().email(),
    firstName: Joi.string().min(3).max(255),
    lastName: Joi.string().min(3).max(255),
    password: Joi.string().min(6).max(255).required(),
    favoriteRestaurants: Joi.array().items(Joi.string().hex().length(24)),
  });

  // return Joi.validateUser(user, schema);
  return schema.validate(user);
}

//1d
UserSchema.pre("save", async function () {
  //password hashing
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

//1g
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//1i
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    config.get("appPrivateKey")
  );

  return token;
};

//1c
const User = mongoose.model("User", UserSchema);

module.exports.User = User;

module.exports.validateUser = validateUser;
