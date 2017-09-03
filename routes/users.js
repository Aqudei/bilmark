var express = require('express');
var User = require('../models/user');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find({}).exec((err, users) => {
    if (err) {
      return next(err);
    }

    res.send(users);
  });
});

module.exports = router;
