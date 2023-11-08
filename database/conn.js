import mongoose, { connect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectToDb = async () => {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();
  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(getUri);
  console.log("DB connect");
  return db;
};

export default connectToDb;
