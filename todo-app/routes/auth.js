 import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));

/* router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.redirect('/auth/register');
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashed });
  await newUser.save();
  req.login(newUser, (err) => {
    if (err) {
      console.error('Login after registration failed:', err);
      return next(err);
    }
    console.log('Auto-login success. Redirecting to dashboard...');
    return res.redirect('/dashboard');
  });
  
  
}); */
router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    req.flash('error_msg', 'All fields are required');
    return res.redirect('/auth/register');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/auth/register');
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/auth/register');
  }
  console.log('Registering:', name, email);

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

export default router; 