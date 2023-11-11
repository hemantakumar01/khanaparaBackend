const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  data: [],
});

module.exports = mongoose.model("data", DataSchema);
