var User = require('./models/user');
var jwt = require('jsonwebtoken');
var config = require('./config');
var passport = require('passport');
var passportJWT = require('passport-jwt');

function Authenticator() {

    this.getAuthenticator = function () {
        return passport.authenticate('jwt', { session: false });
    };

    this.init = function (app) {

        var opt = {
            secretOrKey: config.secretOrKey,
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('Bearer')
        };

        var strategy = new passportJWT.Strategy(opt, (payload, done) => {
            User.findOne({ _id: payload._id }).exec((err, user) => {
                if (!user) {
                    return done(new Error('error or user not found'), null);
                } else {
                    return done(null, user);
                }
            });
        });

        passport.initialize();
        passport.use(strategy);

        app.post('/token', function (req, res, next) {
            var username = req.body.username;
            var password = req.body.password;

            if (!username || !password) {
                return next(new Error('username and password must be provided'));
            }

            User.findOne({
                username: username
            }).exec((err, user) => {
                if (!err && user) {
                    user.verifyPassword(password, (err, ok) => {
                        if (ok) {
                            var payload = {
                                _id: user._id,
                                username: user.username
                            };
                            var token = jwt.sign(payload, config.secretOrKey, { expiresIn: "2h" });
                            return res.send({
                                status: 'good',
                                token: token
                            });
                        } else {
                            return next(new Error('Invalid username and/or password.'));
                        }
                    });
                } else {
                    return next(new Error('Invalid username and/or password.'));
                }
            });


        });
    };
}

exports.Authenticator = new Authenticator();