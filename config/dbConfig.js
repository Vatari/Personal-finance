const mongoose = require("mongoose");
require("../models/User");

const dbName = "money-gone";
const connectionString = `mongodb://localhost:27017/${dbName}`;

module.exports = async (app) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connection established");
    mongoose.connection.on("error", (err) => {
      console.log("Database connection error");
      console.log(err);
    });
  } catch (err) {
    console.error("Error connecting to database");
    process.exit(1);
  }
};

