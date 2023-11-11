const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email exists"],
  },
  firstName: { type: String },
  lastName: { type: String },
  profile: { type: String },
});

module.exports = mongoose.model("User", userSchema);
