import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    // For local authentication
    username: { type: String, required: false, unique: true, sparse: true }, // Made unique and sparse
    // passportLocalMongoose adds 'password'
    googleId: { type: String, default: null, unique: true, sparse: true }, // For Google auth
    email: { type: String, required: true, unique: true }, //  required and unique
    displayName: String, // Added for consistency
    createdAt: { type: Date, default: Date.now },
});

// Add passport-local-mongoose to handle password hashing for local auth
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
export default User;


