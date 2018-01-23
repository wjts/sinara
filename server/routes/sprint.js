var _ = require('lodash');
var express = require('express');
var {ObjectID} = require('mongodb');

var {Sprint} = require('./../models/sprint');
var {mongoose} = require('./../db/mongoose');
var {authenticate} = require('./../middleware/authenticate');

var router = express.Router();

router.post('/sprints', authenticate, (req, res) => {
  var sprint = new Sprint({
    title: req.body.title,
    _creator: res.locals.user._id
  });

  sprint.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/sprints', authenticate, (req, res) => {
  Sprint.find({}).then((sprints) => {
    res.send({sprints});
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/sprints/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Sprint.findOne({
    _id: id
  }).then((sprint) => {
    if (!sprint) {
      return res.status(404).send();
    }

    res.send({sprint});
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/sprints/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Sprint.findOneAndRemove({
    _id: id
  }).then((sprint) => {
    if (!sprint) {
      return res.status(404).send();
    }

    res.send({sprint});
  }).catch((e) => {
    res.status(400).send();
  });
});

router.patch('/sprints/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['title']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Sprint.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((sprint) => {
    if (!sprint) {
      return res.status(404).send();
    }

    res.send({sprint});
  }).catch((e) => {
    res.status(400).send();
  })
});

module.exports = router;
