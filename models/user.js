const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, select: false },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post', required: false }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: false }],
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
});

UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model('User', UserSchema);