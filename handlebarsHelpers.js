module.exports = {
    'ifEquals': function (arg1, arg2, options) {
        return (String(arg1) == String(arg2)) ? options.fn(this) : options.inverse(this);
    }
}