import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));

router.post("/register", async (req, res, next) => {
    console.log("Register POST:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        console.error("❌ Registration failed: Missing username or password");
        req.flash('error_msg', 'Please fill all fields');
        return res.status(400).redirect('/auth/register');
    }

    try {
        const user = new User({ username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Auto-login error:", err);
                return next(err);
            }
            req.flash('success_msg', 'Registration successful! You are now logged in.');
            res.redirect("/dashboard");
        });
    } catch (err) {
        console.error("Registration failed:", err);
        if (err.name === 'UserExistsError') {
            req.flash('error_msg', 'User already exists. Please login.');
            return res.status(400).redirect('/auth/login');
        }
        req.flash('error_msg', 'Error registering user: ' + err.message);
        res.status(500).redirect('/auth/register');
    }
});

router.post('/login', (req, res, next) => {
    console.log("Login POST (auth.js):", req.body); // VERY IMPORTANT LOG
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout((err) => {
        req.flash('success_msg', 'Logged out successfully.');
        res.redirect('/auth/login');
    });
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            req.flash('error_msg', 'Error logging out.');
            return res.redirect("/dashboard");
        }
        req.flash('success_msg', 'Logged out successfully.');
        res.redirect("/login");
    });
});

export default router;

// import express from 'express';
// import passport from 'passport';
// import User from '../models/User.js';

// const router = express.Router();

// router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
// router.get('/register', (req, res) => res.render('register', { title: 'Register' }));

// router.post("/register", async (req, res, next) => {
//     console.log("Register POST:", req.body); // Debugging
//     const { username, password } = req.body;

//     if (!username || !password) {
//         console.error("❌ Registration failed: Missing username or password");
//         req.flash('error_msg', 'Please fill all fields');
//         return res.status(400).redirect('/auth/register');
//     }

//     try {
//         const user = new User({ username });
//         const registeredUser = await User.register(user, password);

//         req.login(registeredUser, (err) => {
//             if (err) {
//                 console.error("Auto-login error:", err);
//                 return next(err);
//             }
//             req.flash('success_msg', 'Registration successful! You are now logged in.');
//             res.redirect("/dashboard");
//         });
//     } catch (err) {
//         console.error("Registration failed:", err);
//         if (err.name === 'UserExistsError') {
//             req.flash('error_msg', 'User already exists. Please login.');
//             return res.status(400).redirect('/auth/login');
//         }
//         req.flash('error_msg', 'Error registering user: ' + err.message);
//         res.status(500).redirect('/auth/register');
//     }
// });

// router.post('/login', (req, res, next) => {
//     console.log("Login POST:", req.body); // Debugging: Check req.body *before* passport.authenticate
//     passport.authenticate('local', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/auth/login',
//         failureFlash: true
//     })(req, res, next); // Wrap passport.authenticate
// });

// // Google Authentication Routes
// router.get('/google', passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     prompt: 'select_account'
// }));

// router.get('/google/callback', passport.authenticate('google', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/auth/login',
//     failureFlash: true
// }));

// router.get('/logout', (req, res) => {
//     req.logout((err) => {
//         req.flash('success_msg', 'Logged out successfully.');
//         res.redirect('/auth/login');
//     });
// });

// router.post("/logout", (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             console.error("Logout error:", err);
//             req.flash('error_msg', 'Error logging out.');
//             return res.redirect("/dashboard");
//         }
//         req.flash('success_msg', 'Logged out successfully.');
//         res.redirect("/login");
//     });
// });

// export default router;



