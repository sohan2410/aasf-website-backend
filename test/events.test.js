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

    //creating a user
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
    
    //logging in the user
    const result = await request(Server)
    .post('/users/login')
    .send({ roll: '2018BCS-000', password: 'aasf_iiitm' });
    token = result.body.token;
  })

  //Create an event object before each test
  beforeEach(async () => {
    
    //creatiing an event
    await eventModel.create({
      name: "webkriti",
      startDate: "07-10-2021",
      numberOfDays: 2,
      category: "technical",
      importance: 0
    })
    
  })

  afterEach(async () => {
    await eventModel.deleteMany({});
  })
  
  after(async () => {
    await userModel.deleteMany({});
  });

  //Test for fetching events
  it('should get events', async() => {
  
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

  })

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
    
    let event = await eventModel.findOne({name:"webkriti"})
    
    /*SUCCESS*/
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

    let event = await eventModel.findOne({name:"webkriti"})

    let response = await request(Server)
      .delete(`/admin/events/${event._id}`)
      .set('Authorization', `bearer ${token}`)
      .send({name:"gitkriti"});
    
    expect(response.status).to.equal(200)
    expect(response.body.message).to.be.a('string')

  })

  
  
  //Test to get the QR code of events
  it("should get the QR code of events",async ()=>{

    let event = await eventModel.findOne({name:"webkriti"})

    /*SUCCESS*/
    let response = await request(Server)
      .get(`/admin/events/qr/${event._id}/1`)
      .set('Authorization', `bearer ${token}`);
    
    expect(response.status).to.equal(200)
    expect(response.body.message).to.be.a('string')
    expect(response.body.qr).to.be.a('string')

    /*FAILURE*/
    response = await request(Server)
      .get(`/admin/events/qr/${event._id}/5`) //Invalid number of days
      .set('Authorization', `bearer ${token}`);
    
    expect(response.status).to.equal(400)
    expect(response.body.message).to.be.a('string')
    })

  
  
  //To add goodies to the events for the eligible students 
  it("should allow to add goodies",async () => {

    const event = await eventModel.findOne({name:"webkriti"})

    await userModel.create({
      _id:"2020BCS-044",
      name:"Kailash Kejriwal",
      password:"123",
      roll:"2020BCS-044"
    })

    /*SUCCESS*/
    let response = await request(Server)
      .post(`/admin/events/goodies`)
      .set('Authorization', `bearer ${token}`)
      .send({roll:"2020BCS-044",eventId:event._id});

      expect(response.status).to.equal(200)
      expect(response.body.message).to.be.a('string')
      
      /*FAILURE*/
    response = await request(Server)
      .post(`/admin/events/goodies`) //Invalid number of days
      .set('Authorization', `bearer ${token}`)
      .send({roll:"2020BCS-044",eventId:"615f758ed92d2b5ee1975eb8"}); //using a random id
      
    expect(response.status).to.equal(400)
    expect(response.body.message).to.be.a('string')

  })

  
  
  //To add goodies to the events for the eligible students 
  it("should allow to add winners",async () => {

    const event = await eventModel.findOne({name:"webkriti"})

    //create sample users
    await userModel.create({
      _id:"2020BCS-045",
      name:"Winner 1",
      password:"123",
      roll:"2020BCS-045"
    })
    await userModel.create({
      _id:"2020BCS-031",
      name:"Winner 2",
      password:"123",
      roll:"2020BCS-031"
    })
    await userModel.create({
      _id:"2020BCS-050",
      name:"Winner 3",
      password:"123",
      roll:"2020BCS-050"
    })

    /*SUCCESS*/
    let response = await request(Server)
      .post(`/admin/events/winners`)
      .set('Authorization', `bearer ${token}`)
      .send({winners:[["2020BCS-044"],["2020BCS-031","2020BCS-050"]],eventId:event._id});
      
      expect(response.status).to.equal(200)
      expect(response.body.message).to.be.a('string')
      
    /*FAILURE*/
    response = await request(Server)
      .post(`/admin/events/winners`) //Invalid number of days
      .set('Authorization', `bearer ${token}`)
      .send({winners:[["2020BCS-044"],["2020BCS-031","2020BCS-055"]],eventId:"615f758ed92d2b5ee1975eb8"}); //using invalid roll number and event id
    
    expect(response.status).to.equal(400)
    expect(response.body.message).to.be.a('string')

  })

});
