import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define a schema for the data1 and data2 subdocuments
const subDataSchema = new Schema({
  results: [
    {
      number: Number,
      hit: {
        type: Boolean,
        default: false,
      },
    },
  ], // Assuming 'results' is a number
});

const mySchema = new Schema(
  {
    firstRound: {
      data1: [subDataSchema],
      data2: [subDataSchema],
    },
  },
  {
    timestamps: true, // Add timestamps option to include createdAt and updatedAt
  }
);

// Create a model based on the schema
const resultsData = mongoose.model("MyModel", mySchema);
export default resultsData;
