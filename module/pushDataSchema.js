import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  data: [],
});

export default mongoose.model("data", DataSchema);
