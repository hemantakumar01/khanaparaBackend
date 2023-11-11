const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectToDb = async () => {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();
  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(getUri);
  console.log("DB connect");
  return db;
};

module.exports = connectToDb;
