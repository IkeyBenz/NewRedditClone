const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
});

CommentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

CommentSchema.pre('find', function (next) {
    this.populate('comments', '-createdAt -updatedAt').populate('author', 'username _id');
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);