const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = function (app) {

    app.post('/posts/:id/comments', (req, res) => {
        const newComment = new Comment(req.body);
        newComment.save().then(response => {
            return Post.findByIdAndUpdate(req.body.post, { $push: { comments: newComment } });
        }).then(response => {
            return User.findByIdAndUpdate(req.body.author, { $push: { comments: newComment } });
        }).then(response => {
            res.redirect(`/posts/${req.params.id}?success=Comment%20saved`);
        }).catch(error => {
            res.redirect(`/posts/${req.params.id}?error=${error.message}`);
        });
    });

}