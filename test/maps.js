var riakEasy = require('../');
var riak = riakEasy.createClient({
  host: 'localhost',
  port: "8087"
});
var assert = require("assert");
var should = require("should");


describe('create map with a register', function () {
  it('should add registers to the key', function (done) {
    riak.updateRegister('map-test-bucket', 'map_test', 'map-test-key1', {
      dude: "sweet",
      color: "blue"
    }, function (
      err,
      result) {
      if (err) throw err;
      result.should.have.property("dude", "sweet");
      result.should.have.property("color", "blue");

      done();
    });
  });
});


describe('remove a register in a map', function () {
  it('should remove the register', function (done) {
    riak.removeRegister('map-test-bucket', 'map_test', 'map-test-key1', ["dude"], function (
      err,
      result) {
      if (err) throw err;
      result.should.have.property("color", "blue");
      result.should.not.have.property("dude", "sweet");
      done();
    });
  });
});


describe('get a map', function () {
  it('should return the map', function (done) {
    riak.getCRDT('map-test-bucket', 'map_test', 'map-test-key1', function (
      err,
      result) {
      if (err) throw err;
      result.should.have.property("color", "blue");
      done();
    });
  });
});

describe('get a map', function () {
  it('should return the map', function (done) {
    riak.getMap('map-test-bucket', 'map_test', 'map-test-key1', function (
      err,
      result) {
      if (err) throw err;
      result.should.have.property("color", "blue");
      done();
    });
  });
});


describe('get a map that doesnt exist', function () {
  it('should return nothing', function (done) {
    riak.getMap('map-test-bucket', 'map_test', 'map-test-key1234', function (
      err,
      result) {
      if (err) throw err;
      result.should.be.empty;
      done();
    });
  });
});