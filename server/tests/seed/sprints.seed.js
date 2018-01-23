var {ObjectID} = require('mongodb');
var jwt = require('jsonwebtoken');

var {Sprint} = require('./../../models/sprint');
var {users} = require('./users.seed');

const sprints = [{
  _id: new ObjectID(),
  title: 'First commitment',
  _creator: users[0]._id
}, {
  _id: new ObjectID(),
  title: 'Another sprint',
  _creator: users[1]._id
}];

const populateSprints = (done) => {
  Sprint.remove({}).then(() => {
    return Sprint.insertMany(sprints);
  }).then(() => done());
};

module.exports = {sprints, populateSprints};
