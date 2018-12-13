const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = function (app) {

    app.post('/posts/:id/comments', (req, res) => {
        const newComment = new Comment(req.body);
        newComment.save().then(() => {
            return Post.findByIdAndUpdate(req.body.post, { $push: { comments: newComment } });
        }).then(() => {
            return User.findByIdAndUpdate(req.body.author, { $push: { comments: newComment } });
        }).then(() => {
            res.redirect(`/posts/${req.params.id}?success=Comment%20saved`);
        }).catch(error => {
            res.redirect(`/posts/${req.params.id}?error=${error.message}`);
        });
    });

    app.patch('/posts/:postId/comments/:id', (req, res) => {
        Comment.findById(req.params.id).then(comment => {
            return (req.user && String(req.user._id) == String(comment.author))
                ? Comment.findByIdAndUpdate(req.params.id, req.body)
                : Promise.reject({ message: 'Unauthorized' });
        }).then(() => {
            res.redirect(`/posts/${req.params.postId}?success=Comment%20Updated`);
        }).catch(error => {
            res.redirect(`/posts/${req.params.postId}?error=${error.message}`);
        });
    });

    app.delete('/posts/:postId/comments/:id', (req, res) => {
        Comment.findById(req.params.id).then(comment => {
            return (req.user && String(req.user._id) == String(comment.author))
                ? User.findByIdAndUpdate(req.user._id, { $pull: { comments: req.params.id } })
                : Promise.reject({ message: 'Unauthorized' });
        }).then(() => {
            return Post.findByIdAndUpdate(req.params.postId, { $pull: { comments: req.params.id } });
        }).then(() => {
            return Comment.findByIdAndDelete(req.params.id);
        }).then(() => {
            res.redirect(`/posts/${req.params.postId}?success="Comment%20Successfully%20Deleted"`);
        }).catch(error => {
            res.redirect(`/posts/${req.params.postId}?error=${error.message}`);
        });
    });

    app.post('/posts/:postId/comments/:id/replies', (req, res) => {
        const newComment = new Comment(req.body);
        newComment.save().then(() => {
            Comment.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } }).then(() => {
                res.redirect(`/posts/${req.params.postId}`);
            });
        });
    });

}