const sinon = require('sinon');
const expect = require('chai').expect

//TODO: add test to fully test controller logic
describe('Data layer', function() {
  context('cruises', function() {
    const Cruises = require('../../data/cruises');
    const cruises = new Cruises();
    it('should call getCruises', function() {
      let myfake = sinon.fake;
      sinon.replace(cruises, 'getCruises', myfake);
      spy = cruises.getCruises = sinon.spy();
      cruises.getCruises();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call getCruise', function() {
      let myfake = sinon.fake;
      sinon.replace(cruises, 'getCruise', myfake);
      spy = cruises.getCruise = sinon.spy();
      cruises.getCruise();
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('bookings', function() {
    const Bookings = require('../../data/bookings');
    const bookings = new Bookings();
    it('should call getBookings', function() {
      let myfake = sinon.fake;
      sinon.replace(bookings, 'getBookings', myfake);
      spy = bookings.getBookings = sinon.spy();
      bookings.getBookings();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call postBookings', function() {
      let myfake = sinon.fake;
      sinon.replace(bookings, 'postBookings', myfake);
      spy = bookings.postBookings = sinon.spy();
      bookings.postBookings();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call getBooking', function() {
      let myfake = sinon.fake;
      sinon.replace(bookings, 'getBooking', myfake);
      spy = bookings.getBooking = sinon.spy();
      bookings.getBooking();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call putBooking', function() {
      let myfake = sinon.fake;
      sinon.replace(bookings, 'putBooking', myfake);
      spy = bookings.putBooking = sinon.spy();
      bookings.putBooking();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call deleteBooking', function() {
      let myfake = sinon.fake;
      sinon.replace(bookings, 'deleteBooking', myfake);
      spy = bookings.deleteBooking = sinon.spy();
      bookings.deleteBooking();
      expect(spy.calledOnce).to.equal(true);
    });
  });
  context('customers', function() {
    const Customers = require('../../data/customers');
    const customers = new Customers();
    it('should call getCustomers', function() {
      let myfake = sinon.fake;
      sinon.replace(customers, 'getCustomers', myfake);
      spy = customers.getCustomers = sinon.spy();
      customers.getCustomers();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call postCustomers', function() {
      let myfake = sinon.fake;
      sinon.replace(customers, 'postCustomers', myfake);
      spy = customers.postCustomers = sinon.spy();
      customers.postCustomers();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call getCustomer', function() {
      let myfake = sinon.fake;
      sinon.replace(customers, 'getCustomer', myfake);
      spy = customers.getCustomer = sinon.spy();
      customers.getCustomer();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call putCustomer', function() {
      let myfake = sinon.fake;
      sinon.replace(customers, 'putCustomer', myfake);
      spy = customers.putCustomer = sinon.spy();
      customers.putCustomer();
      expect(spy.calledOnce).to.equal(true);
    });
    it('should call deleteCustomer', function() {
      let myfake = sinon.fake;
      sinon.replace(customers, 'deleteCustomer', myfake);
      spy = customers.deleteCustomer = sinon.spy();
      customers.deleteCustomer();
      expect(spy.calledOnce).to.equal(true);
    });
  });
});

afterEach(() => {
  sinon.restore();
});