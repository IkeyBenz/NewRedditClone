const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    comments: [this]
});

CommentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);