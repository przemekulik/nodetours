/* eslint-disable no-undef */
const sinon = require('sinon');
const express = require('express');

// FIXME: separate positive from negetive tests
describe('Routers', () => {
  context('/', function() {
    it('should accept calls on allowed methods and reject others', () => {
      let routerStub = {
        route: sinon.stub().returnsThis(),
        get: sinon.stub().returnsThis(),
        patch: sinon.stub().returnsThis() // not supported by /
      };
      sinon.stub(express, 'Router').callsFake(() => routerStub);
      require('../../routers/root');
      sinon.assert.calledWith(routerStub.route, '/');
      sinon.assert.neverCalledWith(routerStub.route, '/:wrongParam');
      sinon.assert.calledWith(routerStub.get, sinon.match.func);
      sinon.assert.neverCalledWith(routerStub.patch, sinon.match.func);
    });
  });
  context('/bookings', function() {
    it('should accept calls on allowed methods and reject others', () => {
      let routerStub = {
        route: sinon.stub().returnsThis(),
        post: sinon.stub().returnsThis(),
        get: sinon.stub().returnsThis(),
        put: sinon.stub().returnsThis(),
        delete: sinon.stub().returnsThis(),
        patch: sinon.stub().returnsThis() // not supported by /bookings
      };
      sinon.stub(express, 'Router').callsFake(() => routerStub);
      require('../../routers/bookings');
      sinon.assert.calledWith(routerStub.route, '/');
      sinon.assert.calledWith(routerStub.route, '/:id');
      sinon.assert.neverCalledWith(routerStub.route, '/:wrongParam');
      sinon.assert.calledWith(routerStub.get, sinon.match.func);
      sinon.assert.calledWith(routerStub.post, sinon.match.func);
      sinon.assert.calledWith(routerStub.put, sinon.match.func);
      sinon.assert.calledWith(routerStub.delete, sinon.match.func);
      sinon.assert.neverCalledWith(routerStub.patch, sinon.match.func);
    });
  });
  context('/cruises', function() {
    it('should accept calls on allowed methods and reject others', () => {
      let routerStub = {
        route: sinon.stub().returnsThis(),
        get: sinon.stub().returnsThis(),
        patch: sinon.stub().returnsThis() // not supported by /cruises
      };
      sinon.stub(express, 'Router').callsFake(() => routerStub);
      require('../../routers/cruises');
      sinon.assert.calledWith(routerStub.route, '/');
      sinon.assert.calledWith(routerStub.route, '/:id');
      sinon.assert.neverCalledWith(routerStub.route, '/:wrongParam');
      sinon.assert.calledWith(routerStub.get, sinon.match.func);
      sinon.assert.neverCalledWith(routerStub.patch, sinon.match.func);
    });
  });
  context('/customers', function() {
    it('should accept calls on allowed methods and reject others', () => {
      let routerStub = {
        route: sinon.stub().returnsThis(),
        post: sinon.stub().returnsThis(),
        get: sinon.stub().returnsThis(),
        put: sinon.stub().returnsThis(),
        delete: sinon.stub().returnsThis(),
        patch: sinon.stub().returnsThis() // not supported by /customers
      };
      sinon.stub(express, 'Router').callsFake(() => routerStub);
      require('../../routers/customers');
      sinon.assert.calledWith(routerStub.route, '/');
      sinon.assert.calledWith(routerStub.route, '/:id');
      sinon.assert.neverCalledWith(routerStub.route, '/:wrongParam');
      sinon.assert.calledWith(routerStub.get, sinon.match.func);
      sinon.assert.calledWith(routerStub.post, sinon.match.func);
      sinon.assert.calledWith(routerStub.put, sinon.match.func);
      sinon.assert.calledWith(routerStub.delete, sinon.match.func);
      sinon.assert.neverCalledWith(routerStub.patch, sinon.match.func);
    });
  });
  afterEach(function () {
    sinon.restore();
  });
});