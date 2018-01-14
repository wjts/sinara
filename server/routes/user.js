var _ = require('lodash');
var express = require('express');
var {User} = require('./../models/user');
var {mongoose} = require('./../db/mongoose');

var router = express.Router();

router.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    if (e.code === 11000) {
      res.status(400).send({message: 'An account already exists with that email.'});
    } else {
      res.status(400).send({message: e.message || e.errmsg});
    }
  })
});

module.exports = router;
