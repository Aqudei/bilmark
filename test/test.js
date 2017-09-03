var chai = require('chai');
var User = require('../models/user');

var assert = chai.assert;

describe('db test', function () {
    it('can access db', function (done) {

        var user = new User({
            username: 'uname1   ',
            password: 'pass'
        });

        user.save().then((rslt) => {
            console.log(rslt);
            done();
        }).catch(() => done(1));
    });

    it('can verifyPassword', function (done) {
        var user = new User({
            username: 'uname',
            password: 'pass2'
        });

        user.save().then(rslt => {
            rslt.verifyPassword('pass3', (err, rslt) => {
                assert.isFalse(rslt === true);
                done();
            });
        });
    });
});