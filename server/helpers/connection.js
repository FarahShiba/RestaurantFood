//1.a
const mongoose = require("mongoose");

//connected to mongodb 1B
async function connection(connectionString) {
  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    console.log("Connection failed to MongoDB", error);
    process.exit(1);
  }
}

module.exports.connection = connection;
