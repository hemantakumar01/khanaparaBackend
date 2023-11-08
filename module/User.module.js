import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: [true, "Email exist"],
  },
  firstName: { type: String },
  lastName: { type: String },
  profile: { type: String },
});

export default mongoose.model.Users || mongoose.model("User", userSchema);
