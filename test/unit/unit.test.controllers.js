const sinon = require('sinon')
const expect = require('chai').expect

//TODO: add test to fully test controller logic
describe('Controllers', function() {
  context('/', function() {
    const rootController = require('../../controllers/root');
    it('should call / GET controller', function() {
      let res;
      spy = rootController.root_get = sinon.spy();
      rootController.root_get(null, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('/cruises', function() {
    const cruisesController = require('../../controllers/cruises');
    it('should call /cruises GET controller', function() {
      let res;
      spy = cruisesController.cruises_get = sinon.spy();
      cruisesController.cruises_get(null, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('/cruises/{cruiseID}', function() {
    const cruisesController = require('../../controllers/cruises');
    it('should call /cruises/{cruiseID} GET controller', function() {
      let req, res;
      spy = cruisesController.cruises_get_id = sinon.spy();
      cruisesController.cruises_get_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('/bookings', function() {
    const bookingsController = require('../../controllers/bookings');
    it('should call /bookings GET controller', function() {
      let req, res;
      spy = bookingsController.bookings_get = sinon.spy();
      bookingsController.bookings_get(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call /bookings POST controller', function() {
      let req, res;
      spy = bookingsController.bookings_post = sinon.spy();
      bookingsController.bookings_post(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('/bookings/{bookingID}', function() {
    const bookingsController = require('../../controllers/bookings');
    it('should call /bookings/{bookingID} GET controller', function() {
      let req, res;
      spy = bookingsController.bookings_get_id = sinon.spy();
      bookingsController.bookings_get_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call /bookings/{bookingID} PUT controller', function() {
      let req, res;
      spy = bookingsController.bookings_put_id = sinon.spy();
      bookingsController.bookings_put_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call /bookings/{bookingID} DELETE controller', function() {
      let req, res;
      spy = bookingsController.bookings_delete_id = sinon.spy();
      bookingsController.bookings_delete_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('/customers', function() {
    const customersController = require('../../controllers/customers');
    it('should call /customers GET controller', function() {
      let req, res;
      spy = customersController.customers_get = sinon.spy();
      customersController.customers_get(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call /customers POST controller', function() {
      let req, res;
      spy = customersController.customers_post = sinon.spy();
      customersController.customers_post(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('/customers/{customerID}', function() {
    const customersController = require('../../controllers/customers');
    it('should call /customers/{customerID} GET controller', function() {
      let req, res;
      spy = customersController.customers_get_id = sinon.spy();
      customersController.customers_get_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call /customers/{customerID} PUT controller', function() {
      let req, res;
      spy = customersController.customers_put_id = sinon.spy();
      customersController.customers_put_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call /customers/{customerID} DELETE controller', function() {
      let req, res;
      spy = customersController.customers_delete_id = sinon.spy();
      customersController.customers_delete_id(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
});

afterEach(() => {
  sinon.restore();
});
