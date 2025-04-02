// models/User.js
// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   googleId: { type: String, default: null },
//   name: String,
//   email: { type: String, unique: true, required: true },
//   password: { type: String, default: null },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('User', UserSchema);
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username:/*  String */{ type: String, required: false }
});

// Add passport-local-mongoose to handle password hashing
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
export default User;
