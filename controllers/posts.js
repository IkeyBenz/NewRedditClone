const Post = require('../models/post');
const User = require('../models/user');
module.exports = function (app) {

    // GET new post form
    app.get('/posts/new', (req, res) => {
        res.render('post/new');
    });

    // GET home page
    app.get('/', (req, res) => {
        Post.find({}).populate('author').then(posts => {
            res.render('index', { posts: posts });
        });
    });

    // CREATE new post
    app.post('/posts', (req, res) => {
        const newPost = new Post(req.body);
        newPost.save().then(post => {
            return User.findByIdAndUpdate(req.body.author, { $push: { posts: post } })
        }).then(() => {
            res.redirect('/?success=Successfully%20created%20new%20post');
        }).catch(error => {
            res.redirect(`/?error=${error.message}`);
        });
    });

    // READ specific post
    app.get('/posts/:id', (req, res) => {
        console.log('yer');
        Post.findById(req.params.id)
            .populate('author')
            .populate({ path: 'comments', populate: { path: 'author' } })
            .then(post => {
                res.render('post/show', { post: post });
            });
    });

    // GET update post form
    app.get('/posts/:id/update', (req, res) => {
        Post.findById(req.params.id).then(post => {
            res.render('posts/new', { post: post });
        });
    });

    // UPDATE sepcific post
    app.patch('/posts/:id', (req, res) => {
        Post.findById(req.params.id).then(post => {
            return (String(req.user._id) == String(post.author))
                ? Post.findByIdAndUpdate(req.params.id, req.body)
                : Promise.reject({ message: 'Unauthorized' });
        }).then(() => {
            res.redirect(`/?success=Post%20Successfully%Updated`);
        }).catch(error => {
            res.redirect(`/?error=${error.message}`);
        });
    });

    // DELETE a specific post
    app.delete('/posts/:id', (req, res) => {
        console.log('Ay');
        Post.findById(req.params.id).then(post => {
            var post = post;
            return (req.user && String(req.user._id) == String(post.author))
                ? Post.findByIdAndDelete(req.params.id)
                : Promise.reject({ message: 'Unauthorized' });
        }).then(post => {
            return User.findByIdAndUpdate(post.author, { $pull: { posts: req.params.id } });
        }).then(() => {
            res.redirect(`/users/${req.user._id}?success=Post%20was%20successfully%20deleted`);
        }).catch(error => {
            console.log(error.message);
            res.redirect(`/users/${req.user._id}?error=${error.message}`);
        });
    });

}