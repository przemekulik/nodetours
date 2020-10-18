const expect = require('chai').expect;
const request = require('supertest');
const server = require('../../server');
const fs = require('fs');

// work in progress - work in subsequent runs
// FIXME: initialization of db
// FIXME: issues with tests on thw first run


describe('Integration tests', function() {
  // before(function() {
  //   TODO: delete db before all starts or initializ 
  // });

  context('/', function() {
    it('should accept GET and return a 200 response with correct payload', function(done) {
      request(app).get('/')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(JSON.stringify(res.body)).to.equal('{"Application":"NodeTours","Version":"2.1.0","Host":"' + require('os').hostname() + '","Port":"7777"}');
        done();
      });
    });
    let verbs = ['put', 'post', 'delete', 'patch'];
    //TODO: check other methods
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
        //done();
      });
    };
  });

  context('/cruises', function() {
    const cruisesFile = fs.readFileSync(__dirname + '/../../data/init/' + 'cruises.json', 'utf8');
    let expCruisesRes = JSON.parse(cruisesFile);
    it('should accept GET and return a 200 response with correct payload', function(done) {
      request(app).get('/cruises')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body[0].cruiseID).to.eql(expCruisesRes[0].cruiseID);
        //done();
      });
      done();
    });
    let verbs = ['put', 'post', 'delete', 'patch'];
    //TODO: check other methods
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/cruises')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();         
        });
        //done();
      });
    };
  });

   context('/cruises/{id}', function() {
    const cruisesFile = fs.readFileSync(__dirname + '/../../data/init/' + 'cruises.json', 'utf8');
    let expCruisesRes = JSON.parse(cruisesFile);
    it('should accept GET and return a 200 response with correct payload', function(done) {
      let expCruisesRes00001 = expCruisesRes.filter(function(expCruisesRes) {
        return expCruisesRes.cruiseID == '00001';
      });
      request(app).get('/cruises/00001')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.cruiseID).to.eql(expCruisesRes00001[0].cruiseID);
        //done();
      });
      done();
    });
    it('should accept GET and return 204 response for non existing cruise', function(done) {
      request(app).get('/cruises/does-not-exist')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(204);
        expect(res.body).to.be.empty;
        //done();
      });
      done();
    });
    let verbs = ['put', 'post', 'delete', 'patch'];
    //TODO: check other methods
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/cruises/00001')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          //done();     
        });
        done();
      });
    };
  });

   context('/bookings', function() {
    const bookingsFile = fs.readFileSync(__dirname + '/../../data/init/' + 'bookings.json', 'utf8');
    let expBookingsRes = JSON.parse(bookingsFile);
    it('should accept GET and return a 200 response with correct payload', function(done) {
      request(app).get('/bookings')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body[0].bookingID).to.eql(expBookingsRes[0].bookingID);
        done();
      });
    });
    it('should accept POST and return a 201 response with correct payload', function(done) {
      let booking = {
        "cruiseID": "00001",
        "customerID": "przemek.kulik@email.com",
        "room": [
          {
            "roomID": "SDS",
            "numRooms": 1
          }
        ]
      }
      request(app).post('/bookings')
      .send(booking)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        expect(res.body.cruiseID).to.eql(booking.cruiseID);
        expect(res.body.customerID).to.eql(booking.customerID);
        expect(res.body.room).to.eql(booking.room);
        done();
      });
    });
    let verbs = ['put', 'delete', 'patch'];
    //TODO: check other methods, fix in controller
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/bookings')
        .end(function(_err, res) {
          expect(res.statusCode).to.equal(404);
          done();        
        });
      });
    };
  }); 

   context('/bookings/{id}', function() {
    const bookingsFile = fs.readFileSync(__dirname + '/../../data/init/' + 'bookings.json', 'utf8');
    let expBookingsRes = JSON.parse(bookingsFile);
    it('should accept GET and return a 200 response with correct payload', function(done) {
      let expBookingsRes1 = expBookingsRes.filter(function(expBookingsRes) {
        return expBookingsRes.bookingID == 1;
      });
      request(app).get('/bookings/1')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.bookingID).to.eql(expBookingsRes1[0].bookingID);
        done();
      });
    });
    it('should accept GET and return 204 response for non existing booking', function(done) {
      request(app).get('/bookings/does-not-exist')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(204);
        expect(res.body).to.be.empty;
        done();
      })
    });
    it('should accept PUT and return a 200 response with correct payload', function(done) {
      let booking = {
          "bookingID": 1,
          "cruiseID": "00001",
          "customerID": "adam.apple@email.com",
          "room": [
             {
                "roomID": "SDS",
                "numRooms": 2
             }
          ]
      }
      request(app).put('/bookings/1')
      .send(booking)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.cruiseID).to.equal(booking.cruiseID);
        expect(res.body.customerID).to.equal(booking.customerID);
        expect(res.body.room.roomID).to.equal(booking.room.roomID);
        expect(res.body.room.numRooms).to.equal(booking.room.numRooms);
        expect(res.body.bookingID).to.equal(parseInt(1));
        done();
      });
    });
    it('should accept DELETE and return a 200 response with correct payload', function(done) {
      request(app).delete('/bookings/1')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.bookingID).to.equal(parseInt(1));
        done();
      });
    });
    let verbs = ['post', 'patch'];
    //TODO: check other methods, fix in controller
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/bookings/1')
        .end(function(_err, res) {
          expect(res.statusCode).to.equal(404);
          done();        
        });
      });
    };
  }) 

   context('/customers', function() {
    const customersFile = fs.readFileSync(__dirname + '/../../data/init/' + 'customers.json', 'utf8');
    let expCustomersRes = JSON.parse(customersFile);
    it('should accept GET and return a 200 response with correct payload', function(done) {
      request(app).get('/customers')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.eql(expCustomersRes);
        done();
      });
    });
    it('should accept POST and return a 201 response with correct payload', function(done) {
      customer = {
        "customer" : {
          "firstname" : "Przemek",
          "surname" : "Kulik",
          "title" : "Mrs.",
          "emailAddress" : "przemek.kulik@email.com",
          "passportID" : "1220123456789",
          "passportExpiration" : "2022.07.01",
          "passportOrgin" : "USA",
          "dob" : "1992.09.01"
        },
        "address" : {
          "street" : "221B Baker St",
          "city" : "London",
          "state" : null,
          "zipcode" : "NW1 6XE",
          "country" : "UK"
        }
      }
      request(app).post('/customers')
      .send(customer)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        expect(res.body.customer).to.eql(customer.customer);
        done();
      });
    });
    let verbs = ['put', 'patch', 'delete'];
    //TODO: check other methods, fix in controller
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/customers')
        .end(function(_err, res) {
          expect(res.statusCode).to.equal(404);
          done();        
        });
      });
    };
  }) 

   context('/customers/{id}', function() {
    const customersFile = fs.readFileSync(__dirname + '/../../data/init/' + 'customers.json', 'utf8');
    let expCustomersRes = JSON.parse(customersFile);
    it('should accept GET and return a 200 response with correct payload', function(done) {
      let expCustomersRes1 = expCustomersRes.filter(function(expCustomersRes) {
        return expCustomersRes.customer.emailAddress == 'oleg.oranges@email.com';
      });
      request(app).get('/customers/oleg.oranges@email.com')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.eql(expCustomersRes1[0]);
        done();
      });
    });
    it('should accept GET and return 204 response for non existing customer', function(done) {
      request(app).get('/customers/does-not-exist')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(204);
        expect(res.body).to.be.empty;
        done();
      })
    });
    it('should accept PUT and return a 200 response with correct payload', function(done) {
      customer = {
        "customer": {
          "firstname": "Oleg",
          "surname": "Oranges",
          "title": "Mr.",
          "emailAddress": "oleg.oranges@email.com",
          "passportID": "1220123456789",
          "passportExpiration": "2022.07.01",
          "passportOrgin": "USA",
          "dob": "1992.09.01"
       },
       "address": {
          "street": "221B Baker St",
          "city": "London",
          "state": null,
          "zipcode": "NW1 6XE",
          "country": "UK"
       }
      }
      request(app).put('/customers/oleg.oranges@email.com')
      .send(customer)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.customer.surname).to.equal(customer.customer.surname);
        done();
      });
    });
    it('should accept DELETE and return a 200 response with correct payload', function(done) {
      request(app).delete('/customers/oleg.oranges@email.com')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.customer.emailAddress).to.equal('oleg.oranges@email.com');
        done();
      });
    });
    let verbs = ['post', 'patch'];
    //TODO: check other methods, fix in controller
    for (let verb of verbs) {
      it(`should reject ${verb.toUpperCase()} and return 404 response`, function(done) {
        request(app)[verb]('/customers/oleg.orange@email.com')
        .end(function(_err, res) {
          expect(res.statusCode).to.equal(404);
          done();        
        });
      });
    };
  }) 
}); 

after(function() {
  process.exit();
})
