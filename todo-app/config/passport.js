import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const passportConfig = (passport) => {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            console.log('LocalStrategy called with:', { username, password, body: req.body }); // SHOW EVERYTHING
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    console.log('No user found with username:', username);
                    return done(null, false, { message: 'No user found with that username' });
                }

                if (!user.password) {
                    console.log('Password not set for user:', username);
                    return done(null, false, { message: 'Password not set for this account.  Use Google Login.' });
                }
                const isMatch = await user.verifyPassword(password);
                if (!isMatch) {
                    console.log('Incorrect password for user:', username);
                    return done(null, false, { message: 'Incorrect password' });
                }
                console.log('Authentication successful for user:', username);
                return done(null, user);

            } catch (err) {
                console.error('LocalStrategy error:', err);
                return done(err);
            }
        }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        console.log('GoogleStrategy callback called');
        try {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                console.log('Google user found:', existingUser);
                return done(null, existingUser);
            } else {
                const newUser = new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.emails[0].value,
                });
                await newUser.save();
                console.log('Google user created:', newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error('GoogleStrategy error:', err);
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        console.log('serializeUser:', user.id);
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log('deserializeUser id:', id);
        try {
            const user = await User.findById(id);
            console.log('deserializeUser user:', user);
            done(null, user);
        } catch (err) {
            console.error('deserializeUser error:', err);
            done(err);
        }
    });
};

export default passportConfig;


// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import User from '../models/User.js'; // Ensure this User model uses passport-local-mongoose

// const passportConfig = (passport) => {
//   // Local Strategy for username/password authentication
//   passport.use(new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
//   },
//     async (req, username, password, done) => {
//       console.log('LocalStrategy called with:', { username }); // Debugging
//       try {
//         const user = await User.findOne({ username });

//         if (!user) {
//           console.log('No user found with username:', username); // Debugging
//           return done(null, false, { message: 'No user found with that username' });
//         }

//         if (!user.password) {
//           console.log('Password not set for user:', username); // Debugging
//           return done(null, false, { message: 'Password not set for this account.  Use Google Login.' });
//         }

//         const isMatch = user.verifyPassword(password);
//         if (!isMatch) {
//           console.log('Incorrect password for user:', username); // Debugging
//           return done(null, false, { message: 'Incorrect password' });
//         }
//         console.log('Authentication successful for user:', username); // Debugging
//         return done(null, user);

//       } catch (err) {
//         console.error('LocalStrategy error:', err); // Debugging
//         return done(err);
//       }
//     }));

//   // Google Strategy for Google authentication
//   passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback',
//     passReqToCallback: true
//   }, async (req, accessToken, refreshToken, profile, done) => {
//     console.log('GoogleStrategy callback called'); // Debugging
//     try {
//       const existingUser = await User.findOne({ googleId: profile.id });
//       if (existingUser) {
//         console.log('Google user found:', existingUser);  //Debugging
//         return done(null, existingUser);
//       } else {
//         // Create a new user, and since this is google login, the password is not set
//         const newUser = new User({
//           googleId: profile.id,
//           displayName: profile.displayName,
//           email: profile.emails[0].value,
//           username: profile.emails[0].value, //set the username to email.
//         });
//         await newUser.save();
//         console.log('Google user created:', newUser); // Debugging
//         return done(null, newUser);
//       }
//     } catch (err) {
//       console.error('GoogleStrategy error:', err);  //Debugging
//       return done(err);
//     }
//   }));

//   // Serialize and Deserialize User functions
//   passport.serializeUser((user, done) => {
//     console.log('serializeUser:', user.id); // Debugging
//     done(null, user.id);
//   });

//   passport.deserializeUser(async (id, done) => {
//     console.log('deserializeUser id:', id);  //Debugging
//     try {
//       const user = await User.findById(id);
//       console.log('deserializeUser user:', user); // Debugging
//       done(null, user);
//     } catch (err) {
//       console.error('deserializeUser error:', err); // Debugging
//       done(err);
//     }
//   });
// };

// export default passportConfig;



// // import { Strategy as LocalStrategy } from 'passport-local';
// // import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// // import bcrypt from 'bcryptjs'; // Used for local auth
// // import User from '../models/User.js'; // Ensure this User model uses passport-local-mongoose

// // const passportConfig = (passport) => {
// //   // Local Strategy for username/password authentication
// //   passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => { // Changed usernameField to 'username'
// //     try {
// //       const user = await User.findOne({ username }); // Find by username

// //       if (!user) {
// //         return done(null, false, { message: 'No user found with that username' }); // Changed message
// //       }

// //       // passport-local-mongoose handles password checking, so we don't use bcrypt.compare here
// //       if (!user.password) { // Check if the password was set.
// //         return done(null, false, { message: 'Password not set for this account.  Use Google Login.' });
// //       }

// //       const isMatch = user.verifyPassword(password); // Use the function provided by passport-local-mongoose
// //       if (!isMatch) {
// //         return done(null, false, { message: 'Incorrect password' });
// //       }
// //       return done(null, user);

// //     } catch (err) {
// //       return done(err);
// //     }
// //   }));

// //   // Google Strategy for Google authentication
// //   passport.use(new GoogleStrategy({
// //     clientID: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     callbackURL: '/auth/google/callback',
// //     passReqToCallback: true  //Important, to pass req
// //   }, async (req, accessToken, refreshToken, profile, done) => {
// //     try {
// //       const existingUser = await User.findOne({ googleId: profile.id });
// //       if (existingUser) {
// //         return done(null, existingUser);
// //       } else {
// //         // Create a new user, and since this is google login, the password is not set
// //         const newUser = new User({
// //           googleId: profile.id,
// //           displayName: profile.displayName, // Changed from name to displayName
// //           email: profile.emails[0].value,
// //           username: profile.emails[0].value, //set the username to email.
// //         });
// //         await newUser.save();
// //         return done(null, newUser);
// //       }
// //     } catch (err) {
// //       return done(err);
// //     }
// //   }));

// //   // Serialize and Deserialize User functions
// //   passport.serializeUser((user, done) => {
// //     done(null, user.id);
// //   });

// //   passport.deserializeUser(async (id, done) => {
// //     try {
// //       const user = await User.findById(id);
// //       done(null, user);
// //     } catch (err) {
// //       done(err);
// //     }
// //   });
// // };

// // export default passportConfig;


// // import { Strategy as LocalStrategy } from 'passport-local';
// // import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// // import bcrypt from 'bcryptjs';
// // import User from '../models/User.js';

// // const passportConfig = (passport) => {
// //   passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
// //     try {
// //       const user = await User.findOne({ email });
  
// //       if (!user) return done(null, false, { message: 'No user found' });
  
// //       if (typeof user.password !== 'string') {
// //         return done(null, false, { message: 'Password not set for this account' });
// //       }
  
// //       const isMatch = await bcrypt.compare(password, user.password);
// //       return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' });
  
// //     } catch (err) {
// //       return done(err);
// //     }
// //   }));
  

  

  

// //   passport.use(new GoogleStrategy({
// //     clientID: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     callbackURL: '/auth/google/callback'
// //   }, async (accessToken, refreshToken, profile, done) => {
// //     try {
// //       const existingUser = await User.findOne({ googleId: profile.id });
// //       if (existingUser) return done(null, existingUser);
// //       const newUser = await User.create({
// //         googleId: profile.id,
// //         name: profile.displayName,
// //         email: profile.emails[0].value
// //       });
// //       return done(null, newUser);
// //     } catch (err) {
// //       return done(err);
// //     }
// //   }));

// //   passport.serializeUser((user, done) => done(null, user.id));
// //   passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
// // };

// // export default passportConfig;