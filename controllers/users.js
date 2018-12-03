const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Get sign up page
router.get('/signup', (req, res) => {
    res.render('user/signup');
});

// Get sign in page
router.get('/signin', (req, res) => {
    res.render('user/signin');
});

// Create new user
router.post('/signup', (req, res) => {
    const newUser = new User(req.body);
    newUser.save().then(user => {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    }).catch(error => {
        res.redirect(`/signin?error=${error.message}`);
    });
});

// Sign currently existing user in
router.post('/signin', (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            user.comparePassword(req.body.password, (error, matched) => {
                if (matched) {
                    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
                    res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                    res.redirect('/');
                } else {
                    res.redirect('/signin?error=Incorrect%20Password');
                }
            });
        } else {
            res.redirect('/signin?error=Incorrect%20Username');
        }
    });
});

router.get('/signout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
});

router.get('/users/:id', (req, res) => {
    User.findById(req.params.id).then(user => {
        res.render('user/profile', { user: user });
    });
});

module.exports = router;