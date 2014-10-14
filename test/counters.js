var riakEasy = require('../');
var riak = riakEasy.createClient({
  host: 'localhost',
  port: "8087"
});
var assert = require("assert");
var should = require("should");

var key = 'counter-test-key' + Math.random();

describe('create counter', function () {
  it('should set its value to 1', function (done) {
    riak.incrementCounter('counter-test-bucket', 'counter_test', key, 1,
      function (
        err,
        result) {
        if (err) throw err;
        result.should.equal(1);
        done();
      });
  });
});


describe('decrement a counter', function () {
  it('should set its value to -4', function (done) {
    riak.incrementCounter('counter-test-bucket', 'counter_test', key, -5,
      function (
        err,
        result) {
        if (err) throw err;
        result.should.equal(-4);
        done();
      });
  });
});

describe('get a counter', function () {
  it('should return the number', function (done) {
    riak.getCounter('counter-test-bucket', 'counter_test', key, function (
      err,
      result) {
      if (err) throw err;
      result.should.equal(-4);
      done();
    });
  });
});


describe('get a counter that doesnt exist', function () {
  it('should return 0', function (done) {
    riak.getCounter('counter-test-bucket', 'counter_test', key + 'doesntexist', function (
      err,
      result) {
      if (err) throw err;
      result.should.equal(0);
      done();
    });
  });
});