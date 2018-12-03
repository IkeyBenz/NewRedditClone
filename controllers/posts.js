const Post = require('../models/post');
const User = require('../models/user');
module.exports = function (app) {

    // Get new post form
    app.get('/posts/new', (req, res) => {
        res.render('post/new');
    });

    app.get('/', (req, res) => {
        Post.find({}).populate('author').then(posts => {
            console.log(posts);
            res.render('index', { posts: posts });
        });
    });

    // Create new post
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

    // Read specific post
    app.get('/posts/:id', (req, res) => {
        Post.findById(req.params.id).populate('author').then(post => {
            res.render('post/show', { post: post });
        });
    });

    // Get update post form
    app.get('/posts/:id/update', (req, res) => {
        Post.findById(req.params.id).then(post => {
            res.render('posts/new', { post: post });
        });
    });

    // Update sepcific post
    app.patch('/posts/:id', (req, res) => {
        Post.findByIdAndUpdate(req.params.id, req.body).then(post => {
            res.redirect(`/?success=Post%20was%20successfully%updated`);
        }).catch(error => {
            res.redirect(`/?error=${error.message}`);
        });
    });

    app.delete('/posts/:id', (req, res) => {
        Post.findByIdAndRemove(req.params.id).then(response => {
            res.redirect('/?success=Post%20was%20successfully%20deleted');
        }).catch(error => {
            res.redirect(`/?error=${error.message}`);
        });
    });

}