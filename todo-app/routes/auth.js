 import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));


// router.post('/register', async (req, res, next) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     req.flash('error_msg', 'Please fill all fields');
//     return res.redirect('/auth/register');
//   }

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       req.flash('error_msg', 'User already exists. Please login.');
//       return res.redirect('/auth/login');
//     }

//     const hashed = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashed });

//     await newUser.save();

//     req.login(newUser, (err) => {
//       if (err) return next(err);
//       return res.redirect('/dashboard');
//     });
//   } catch (err) {
//     console.error(err);
//     res.redirect('/auth/register');
//   }
// });
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.error("❌ Registration failed: Missing username or password");
    return res.status(400).send("Missing username or password");
  }

  try {
    const user = new User({ username });

    // Register the user (this hashes the password)
    const registeredUser = await User.register(user, password);

    // Immediately log them in after registration
    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
        return res.status(500).send("Login failed after registration");
      }
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).send("Error registering user");
  }
});




router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login'
}));

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/auth/login'));
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/dashboard");
    }
    res.redirect("/login");
  });
});


export default router; 