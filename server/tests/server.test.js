var expect = require('expect');
var request = require('supertest');
var {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {User} = require('./../models/user');
var {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'Pass1234';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'a',
        password: 'b'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123456'
      })
      .expect(400)
      .end(done);
  });
});
