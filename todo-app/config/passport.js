import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const passportConfig = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
  
      if (!user) return done(null, false, { message: 'No user found' });
  
      if (typeof user.password !== 'string') {
        return done(null, false, { message: 'Password not set for this account' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' });
  
    } catch (err) {
      return done(err);
    }
  }));
  

  

  

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);
      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
};

export default passportConfig;