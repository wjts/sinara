var expect = require('expect');
var request = require('supertest');
var {ObjectID} = require('mongodb');

var {app} = require('./../../server');
var {Sprint} = require('./../../models/sprint');
var {users} = require('./../seed/users.seed');
var {sprints, populateSprints} = require('./../seed/sprints.seed');

beforeEach(populateSprints);

describe('POST /sprints', () => {
  it('should create a new sprint', (done) => {
    var title = 'Test commitment';

    request(app)
      .post('/sprints')
      .set('x-auth', users[0].tokens[0].token)
      .send({title})
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Sprint.find({title}).then((sprints) => {
          expect(sprints.length).toBe(1);
          expect(sprints[0].title).toBe(title);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create sprint with invalid body data', (done) => {
    request(app)
      .post('/sprints')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Sprint.find().then((sprints) => {
          expect(sprints.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /sprints', () => {
  it('should get all sprints', (done) => {
    request(app)
      .get('/sprints')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.sprints.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /sprints/:id', () => {
  it('should return sprint doc', (done) => {
    request(app)
      .get(`/sprints/${sprints[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.sprint.title).toBe(sprints[0].title);
      })
      .end(done);
  });

  it('should return 404 if sprint not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/sprints/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/sprints/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /sprints/:id', () => {
  it('should remove a sprint', (done) => {
    var hexId = sprints[1]._id.toHexString();

    request(app)
      .delete(`/sprints/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.sprint._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Sprint.findById(hexId).then((sprint) => {
          expect(sprint).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if sprint not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/sprints/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/sprints/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /sprints/:id', () => {
  it('should update the sprint', (done) => {
    var hexId = sprints[0]._id.toHexString();
    var title = 'This should be the new title';

    request(app)
      .patch(`/sprints/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        title
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.sprint.title).toBe(title);
        expect(typeof res.body.sprint.updatedAt).toBe('number');
      })
      .end(done);
  });
});
