import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import passportConfig from './config/passport.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';

const app = express();

dotenv.config();
passportConfig(passport);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  import User from './models/User.js';

// This will remove the unnecessary index on 'username' field
mongoose.connection.once('open', async () => {
  try {
    await mongoose.connection.db.collection('users').dropIndex('username_1');
    console.log('Removed index on username');
  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
      console.log('No index on username to remove');
    } else {
      console.error('Error removing index:', err);
    }
  }
});


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
