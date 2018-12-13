const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = function (app) {

    // GET sign up page
    app.get('/signup', (req, res) => {
        res.render('user/signup');
    });

    // GET sign in page
    app.get('/signin', (req, res) => {
        res.render('user/signin');
    });

    // CREATE new user
    app.post('/signup', (req, res) => {
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
    app.post('/signin', (req, res) => {
        User.findOne({ username: req.body.username }, 'username password').then(user => {
            if (user) {
                user.comparePassword(req.body.password, (error, matched) => {
                    if (error) {
                        return res.redirect(`/signin?error=${error.message}`);
                    }
                    if (matched) {
                        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
                        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                        res.redirect('/');
                    } else {
                        res.redirect(`/signin?error=Incorrect%20Password`);
                    }
                });
            } else {
                res.redirect('/signin?error=Incorrect%20Username');
            }
        });
    });

    app.get('/signout', (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    });

    // READ specific user
    app.get('/users/:id', (req, res) => {
        User.findById(req.params.id).populate('posts').populate('comments').then(user => {
            res.render('user/profile', { user: user });
        });
    });

    // UPDATE users profile
    app.patch('/users/:id', (req, res) => {
        User.findById(req.params.id).then(user => {
            return (String(req.user._id) == String(user._id))
                ? User.findByIdAndUpdate(req.user._id, req.body)
                : Promise.reject({ message: 'Unauthorized' });
        }).then(() => {
            res.redirect(`/users/${req.params.id}?success=Profile%20Successfully%20Updated`);
        }).catch(error => {
            res.redirect(`/users/${req.params.id}?error=${error.message}`);
        });
    });

    // DELETE user
    app.delete('/users/:id', (req, res) => {
        User.findById(req.params.id).then(user => {
            return (String(req.user._id) == String(user._id))
                ? User.findByIdAndDelete(req.user._id)
                : Promise.reject({ message: 'Unauthorized' });
        }).then(() => {
            res.redirect('/signout');
        }).catch(error => {
            res.redirect(`/users/${req.params.id}?error=${error.message}`);
        });
    });
}
