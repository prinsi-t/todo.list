import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import passportConfig from './config/passport.js'; // Or './config/passport.js' or wherever it IS
import connectMongo from 'connect-mongo';

const app = express();

dotenv.config();
passportConfig(passport);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Session store using connect-mongo
const MongoStore = connectMongo.create({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7,
    autoRemove: 'native'
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // **THIS IS CRITICAL**
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.use(authRoutes);

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


// import express from 'express';
// import mongoose from 'mongoose';
// import session from 'express-session';
// import passport from 'passport';
// import flash from 'connect-flash';
// import dotenv from 'dotenv';
// import methodOverride from 'method-override';
// import connectMongo from 'connect-mongo'; // Import connect-mongo
// import passportConfig from './config/passport.js'; // Ensure this file is correct
// import indexRoutes from './routes/index.js';
// import authRoutes from './routes/auth.js';


// const app = express();

// dotenv.config();
// passportConfig(passport);

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// // Session store using connect-mongo
// const MongoStore = connectMongo.create({
//     client: mongoose.connection.getClient(), // Use the Mongoose connection
//     collectionName: 'sessions', // Optional, defaults to 'sessions'
//     ttl: 60 * 60 * 24 * 7, // 1 week
//     autoRemove: 'native'
// });

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // **Add this line!** To parse JSON request bodies
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore,  // Use connect-mongo
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// app.use(express.static('public'));
// app.use(methodOverride('_method'));




// app.use((req, res, next) => {
//     console.log('Session:', req.session);
//     next();
// });

// app.use(authRoutes);

// app.use((req, res, next) => {
//     res.locals.user = req.user || null;
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

// app.use('/', indexRoutes);
// app.use('/auth', authRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



