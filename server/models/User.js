import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },  
    avatar: { type: String },
    googleId: { type: String }  
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
