var mongoose = require('./');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.methods.verifyPassword = function (plain, cb) {
    var self = this;
    console.log('comparing ' + plain + ' and ' + self.password);
    bcrypt.compare(plain, self.password, cb);
};

userSchema.pre('save', function (next) {
    var self = this;

    if (self.isNew || self.isModified('password')) {
        bcrypt.hash(self.password, 10, function (err, enc) {
            self.password = enc;
            next();
        });
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;