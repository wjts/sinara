var _ = require('lodash');
var express = require('express');

var {User} = require('./../models/user');
var {mongoose} = require('./../db/mongoose');
var {authenticate} = require('./../middleware/authenticate');

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

router.get('/users/me', authenticate, (req, res) => {
  res.send(res.locals.user);
});

router.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/users/me/token', authenticate, (req, res) => {
  res.locals.user.removeToken(res.locals.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;
