var riakEasy = require('../');
var riak = riakEasy.createClient({
  host: 'localhost',
  port: "8087"
});
var assert = require("assert");
var should = require("should");


describe('create set', function () {
  it('should add string items to the set', function (done) {
    riak.updateSet('set-test-bucket', 'set_test', 'set-test-key1', ["dude", "sweet", "cool"], [],
      function (
        err,
        result) {
        if (err) throw err;
        result.should.containEql("dude");
        result.should.containEql("sweet");
        result.should.containEql("cool");
        done();
      });
  });
});

describe('remove from a set', function () {
  it('should remove strings from the set', function (done) {
    riak.updateSet('set-test-bucket', 'set_test', 'set-test-key1', [], ["sweet", "cool"],
      function (
        err,
        result) {
        if (err) throw err;
        result.should.containEql("dude");
        result.should.not.containEql("sweet");
        result.should.not.containEql("cool");
        done();
      });
  });
});


describe('get a map', function () {
  it('should return the map', function (done) {
    riak.getSet('set-test-bucket', 'set_test', 'set-test-key-doesnt-exist', function (
      err,
      result) {
      if (err) throw err;

      result.should.be.empty;
      done();
    });
  });
});