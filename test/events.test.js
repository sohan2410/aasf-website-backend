import chai from 'chai';
import request from 'supertest';
import bcrypt from 'bcrypt';
import Server from '../server';
import mongo from '../server/common/mongo';
import userModel from '../server/models/user';
import eventModel from '../server/models/event';


const expect = chai.expect;

chai.use(require('chai-like'));
chai.use(require('chai-things'))

describe('Event Actions', function() {
  let token;

  before(async () => {
    const userPassword = 'aasf_iiitm';
    const saltRounds = 10;

    const password = await bcrypt.hash(userPassword, saltRounds);
    await mongo();
    await userModel.create({
      _id: '2018BCS-000',
      name: 'AASF',
      role: 'admin',
      password,
    });
    
    const result = await request(Server)
      .post('/users/login')
      .send({ roll: '2018BCS-000', password: 'aasf_iiitm' });
    token = result.body.token;
    
    
    after(async () => {
      await userModel.deleteMany({});
      await eventModel.deleteMany({});
    });
  })

    //Test for fetching events
    it('should get events', async() => {
      
      await eventModel.create({
          name: "webkriti",
          startDate: "07-10-2021",
          numberOfDays: 2,
          category: "technical",
          importance: 0
      })
      
      let response = await request(Server)
      .get('/admin/events')
      .set('Authorization', `bearer ${token}`);

      expect(response.body).to.be.an('object');
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.an('string');
      expect(response.body.events).to.be.an('array')
      expect(response.body.events[0].name).to.be.a('string')
      expect(response.body.events[0].startDate).to.be.a('string')
      expect(response.body.events[0].numberOfDays).to.be.a('string')
      expect(response.body.events[0].category).to.be.a('string')
      expect(response.body.events[0].attendance).to.be.an('array')
  });

  //Test for adding events by admin 
  it("should allow to add events",async()=>{

    const event = {
      name: "webkriti",
      startDate: "08-10-2021",
      numberOfDays: 10,
      category: "technical",
      importance: 0
    }

    let response = await request(Server)
      .post('/admin/events')
      .set('Authorization', `bearer ${token}`)
      .send(event);
  
    expect(response.status).to.equal(200)
    expect(response.body).to.be.a('object')
    expect(response.body.message).to.be.a('string')
  })

  //test to check for the editing of events 
  it("should be able to edit events",async()=>{

    /*SUCCESS*/
    await eventModel.create({
      name: "webkriti",
      startDate: "07-10-2021",
      numberOfDays: 2,
      category: "technical",
      importance: 0
    })

    let event = await eventModel.findOne({name:"webkriti"})

    let response = await request(Server)
      .put(`/admin/events/${event._id}`)
      .set('Authorization', `bearer ${token}`)
      .send({name:"gitkriti"});
    
    expect(response.status).to.equal(200)
    expect(response.body.message).to.be.a('string')
    
    /*FAILURE*/
    response = await request(Server)
      .put(`/admin/events/615f758ed92d2b5ee1975eb8`) ///usiing a random event id
      .set('Authorization', `bearer ${token}`)
      .send({name:"gitkriti"});

    expect(response.status).to.equal(400)
    expect(response.body.message).to.be.a('string')
  })

  //Test to delete events 
  it("should delete events",async()=>{

    await eventModel.create({
      name: "webkriti",
      startDate: "07-10-2021",
      numberOfDays: 2,
      category: "technical",
      importance: 0
    })

    let event = await eventModel.findOne({name:"webkriti"})

    let response = await request(Server)
      .delete(`/admin/events/${event._id}`)
      .set('Authorization', `bearer ${token}`)
      .send({name:"gitkriti"});
    
    expect(response.status).to.equal(200)
    expect(response.body.message).to.be.a('string')

  })


});