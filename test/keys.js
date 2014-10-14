var riakEasy = require('../');
var riak = riakEasy.createClient({
  host: 'localhost',
  port: "8087"
});
var assert = require("assert");
var should = require("should");

describe('set() string', function () {
  it('should set a string key', function (done) {
    riak.put('test-bucket', 'test-key1', 'test-value1', function (err, result) {
      if (err) throw err;
      assert.equal('test-value1', result);
      done();
    });
  });
});

describe('set() JSON', function () {
  it('should set a JSON key', function (done) {
    riak.put('test-bucket', 'test-key2',
      '{"test":true,"number":45,"s":"asdf"}', {
        content_type: 'application/json'
      }, function (err, result) {
        if (err) throw err;
        result.should.have.property("test", true);
        result.should.have.property("number", 45);
        result.should.have.property("s", "asdf");
        done();
      });
  });
});

describe('get() string', function () {
  it('should get a string value', function (done) {
    riak.get('test-bucket', 'test-key1', function (err, result) {
      if (err) throw err;
      result.should.equal('test-value1');
      done();
    });
  });
});

describe('get() JSON', function () {
  it('should get a JSON value', function (done) {
    riak.put('test-bucket', 'test-key2',
      '{"test":true,"number":45,"s":"asdf"}', {
        content_type: 'application/json'
      }, function (err, result) {
        if (err) throw err;
        result.should.have.property("test", true);
        result.should.have.property("number", 45);
        result.should.have.property("s", "asdf");
        done();
      });
  });
});

describe('del() a key', function () {
  it('should delete a key', function (done) {
    riak.del('test-bucket', 'test-key1', function (err, result) {
      if (err) throw err;
      assert.deepEqual({}, result);
      done();
    });
  });
});