import chai from 'chai';
import request from 'supertest';
import bcrypt from 'bcrypt';
import Server from '../server';
import mongo from '../server/common/mongo';
import userModel from '../server/models/user';

const expect = chai.expect;

describe('Users Authorization', () => {
  before(async () => {
    const userPassword = 'aasf_iiitm';
    const saltRounds = 10;

    const password = await bcrypt.hash(userPassword, saltRounds);
    await mongo();
    await userModel.create({
      _id: '2018BCS-000',
      name: 'AASF',
      password,
    });
  });

  after(async () => {
    await userModel.deleteMany({});
  });

  it('should login user when provided with right credentials', async () => {
    const response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-000', password: 'aasf_iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('token', 'message');

    expect(response.body.token).to.be.a('string');
    expect(response.body.message).to.be.a('string');
  });

  it('should fail login when provided with wrong credentials', async () => {
    //Incorrect roll number
    let response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-00', password: 'aasf_iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');

    //Incorrect Password
    response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-000', password: 'aasf_iiit' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');
  });
});

describe('User Operations(Change Password, Get Details, Leaderboard)', () => {
  let token;

  before(async () => {
    const userPassword = 'aasf_iiitm';
    const saltRounds = 10;

    const password = await bcrypt.hash(userPassword, saltRounds);
    await mongo();
    await userModel.create({
      _id: '2018BCS-000',
      name: 'AASF',
      password,
    });
    const response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-000', password: 'aasf_iiitm' });
    token = response.body.token;
  });

  after(async () => {
    await userModel.deleteMany({});
  });

  it('changes password successfully for logged-in user', async () => {
    let response = await request(Server)
      .put('/users/password')
      .set('Authorization', `bearer ${token}`)
      .send({ currentPassword: 'aasf_iiitm', newPassword: 'aasf@iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');

    //Check if user can login with new password
    response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-000', password: 'aasf@iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('token', 'message');

    expect(response.body.token).to.be.a('string');
    expect(response.body.message).to.be.a('string');
  });

  it('fails password change for unauthenticated user', async () => {
    let response = await request(Server)
      .put('/users/password')
      .send({ currentPassword: 'aasf@iiitm', newPassword: 'aasf_iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');

    response = await request(Server)
      .put('/users/password')
      .set('Authorization', `bearer dummy`)
      .send({ currentPassword: 'aasf@iiitm', newPassword: 'aasf_iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');
  });

  it('fetches user details for logged-in user', async () => {
    const response = await request(Server)
      .get('/users/details')
      .set('Authorization', `bearer ${token}`);
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys(
      'user',
      'rank',
      'achievements',
      'message'
    );

    expect(response.body.user).to.be.an('object');
    expect(response.body.rank).to.be.a('number');
    expect(response.body.achievements).to.be.an('array');
    expect(response.body.message).to.be.a('string');

    expect(response.body.user).to.include.all.keys(
      '_id',
      'name',
      'score',
      'role'
    );
    expect(response.body.user._id).to.be.a('string');
    expect(response.body.user.name).to.be.a('string');
    expect(response.body.user.score).to.be.an('object');
    expect(response.body.user.role).to.be.a('string');
  });

  it('fetches leaderboard', async () => {
    const response = await request(Server)
      .get('/users/leaderboard')
      .set('Authorization', `bearer ${token}`);

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);

    expect(response.body).to.have.all.keys(
      'totalScore',
      'leaderboard',
      'message'
    );

    expect(response.body.totalScore).to.be.an('object');
    expect(response.body.totalScore).to.have.all.keys(
      'technical',
      'managerial',
      'oratory'
    );

    expect(response.body.totalScore.technical)
      .to.be.a('number')
      .to.equal(0);
    expect(response.body.totalScore.managerial)
      .to.be.a('number')
      .to.equal(0);
    expect(response.body.totalScore.oratory)
      .to.be.a('number')
      .to.equal(0);

    expect(response.body.leaderboard).to.be.an('array');
    expect(response.body.leaderboard[0])
      .to.be.an('object')
      .to.have.all.keys('_id', 'name', 'totalScore');
  });
});

describe('Admin Actions', () => {
  let token;
  before(async () => {
    const userPassword = 'aasf_iiitm';
    const saltRounds = 10;

    const password = await bcrypt.hash(userPassword, saltRounds);
    await mongo();
    await userModel.create({
      _id: '2018BCS-000',
      name: 'AASF',
      password,
    });
    await userModel.create({
      _id: '2018BCS-031',
      name: 'Guna Shekar',
      role: 'admin',
      password,
    });

    const response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-031', password: 'aasf_iiitm' });
    token = response.body.token;
  });

  after(async () => {
    await userModel.deleteMany({});
  });

  it('allows admin to change user details', async () => {
    let response = await request(Server)
      .put('/admin/users/2018BCS-000')
      .set('Authorization', `bearer ${token}`)
      .send({ password: 'aasf@iiitm' });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);

    response = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-000', password: 'aasf@iiitm' });
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
  });
});

describe('Rate Limit', function() {
  this.timeout(20000);
  it('should throw an error if requests exceeds 100 within 10 minutes for each IP', done => {
    setTimeout(async () => {
      for (var i = 1; i <= 101; i++) {
        const response = await request(Server).get('/events');

        if (i !== 101) {
          expect(response.body).to.be.an('object');
          expect(response.status).to.equal(200);
          expect(response.body).to.have.all.keys('events', 'message');
        } else {
          expect(response.status).to.equal(429);
        }
      }
      done();
    }, 11000);
  });
});
