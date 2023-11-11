const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define a schema for the data1 and data2 subdocuments
const subDataSchema = new Schema({
  results: [
    {
      number: Number,
      hit: {
        type: Boolean,
        default: false,
      },
      play: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const mySchema = new Schema(
  {
    firstRound: {
      data1: [subDataSchema],
      data2: [subDataSchema],
    },
  },
  {
    timestamps: true,
  }
);

// Create a model based on the schema
const resultsData = mongoose.model("MyModel", mySchema);

module.exports = resultsData;
