var RiakPBC = require('riakpbc');

var riakEasy = function (opts) {
  this.client = RiakPBC.createClient({
    host: 'localhost',
    port: "8087"
  });

  // in case you want to skip the wrapper
  this.riakClient = this.client;
}

// simple put for key/val store
riakEasy.prototype.put = function (bucket, key, value, opts, callback) {
  if (typeof (opts) === "function") {
    callback = opts;
    var content = {};
  }
  else {
    var content = opts;
  }

  content.value = value;

  this.client.put({
    bucket: bucket,
    key: key,
    content: content,
    return_body: true
  }, function (err, reply) {
    if (err) return callback(err);
    return callback(undefined, reply.content[0].value);
  });
};

// simple get of a value by key (for maps, sets and counters, see getCRDT)
riakEasy.prototype.get = function (bucket, key, callback) {
  this.client.get({
    bucket: bucket,
    key: key
  }, function (err, reply) {
    if (err) return callback(err);
    return callback(undefined, reply.content[0].value.toString());
  });
};

// simple get of a value by key (for maps, sets and counters, see getCRDT)
riakEasy.prototype.del = function (bucket, key, callback) {
  this.client.del({
    bucket: bucket,
    key: key
  }, function (err, reply) {
    if (err) return callback(err);
    return callback(undefined, reply);
  });
};


/**
 * counters
 */
riakEasy.prototype.incrementCounter = function (bucket, bucketType, key, val, callback) {

  this.client.putCrdt({
    bucket: bucket,
    key: key,
    type: bucketType,
    op: {
      counter_op: {
        increment: val
      }
    },
    return_body: true
  }, function (err, reply) {
    if (err) return callback(err);
    return callback(undefined, reply.counter_value.low);
  });
};

/**
 * sets
 */

riakEasy.prototype.updateSet = function (bucket, bucketType, key, addItems, removeItems, callback) {

  var ops = {};
  if (addItems && addItems.length) {
    ops.adds = addItems;
  }
  if (removeItems && removeItems.length) {
    ops.removes = removeItems;
  }

  this.client.putCrdt({
    bucket: bucket,
    key: key,
    type: bucketType,
    op: {
      set_op: ops
    },
    return_body: true
  }, function (err, reply) {
    if (err) return callback(err);
    return callback(undefined, reply.set_value);
  });
};

/**
 * for prettier names
 */

riakEasy.prototype.getMap = function (bucket, bucketType, key, callback) {
  return this.getCRDT(bucket, bucketType, key, callback);
};
riakEasy.prototype.getSet = function (bucket, bucketType, key, callback) {
  return this.getCRDT(bucket, bucketType, key, callback);
};
riakEasy.prototype.getCounter = function (bucket, bucketType, key, callback) {
  return this.getCRDT(bucket, bucketType, key, callback);
};


/**
 * get
 *
 * gets a CRDT value, and returns it correctly based on type
 */
riakEasy.prototype.getCRDT = function (bucket, bucketType, key, callback) {
  this.client.getCrdt({
    bucket: bucket,
    type: bucketType,
    key: key
  }, function (err, response) {
    if (err) return callback(err, response);

    var returnValue;

    switch (response.type) {
    case RiakPBC.DataType.Set:
      returnValue = response.value ? response.value.set_value : [];
      break;
    case RiakPBC.DataType.Counter:
      returnValue = response.value ? response.value.counter_value.low : 0;
      break;
    case RiakPBC.DataType.Map:
      var returnValue = {};
      if (response.value) {
        response.value.map_value.forEach(function (register) {
          returnValue[register.field.name] = register.register_value;
        });
      }
      break;
    }

    return callback(undefined, returnValue);
  });
};

function mapResponseToObject(response) {
  var returnObj = {};
  response.map_value.forEach(function (register) {
    returnObj[register.field.name] = register.register_value;
  });
  return returnObj;
}

// updates a string register in a map
riakEasy.prototype.updateRegister = function (bucket, bucketType, key, object, callback) {

  var updates = [];
  Object.keys(object).forEach(function (k) {
    updates.push({
      field: {
        name: k,
        type: RiakPBC.FieldType.Register
      },
      register_op: object[k]
    });
  });

  if (updates.length) {
    this.client.putCrdt({
      bucket: bucket,
      key: key,
      type: bucketType,
      op: {
        map_op: {
          updates: updates
        }
      },
      return_body: true
    }, function (err, reply) {
      if (err) return callback(err);
      return callback(undefined, mapResponseToObject(reply));
    });
  }
};

// remove the given array of keys from a map
riakEasy.prototype.removeRegister = function (bucket, bucketType, key, registerArr, callback) {

  var remove = [];
  registerArr.forEach(function (k) {
    remove.push({
      name: k,
      type: RiakPBC.FieldType.Register
    });
  });
  if (remove.length) {
    this.client.putCrdt({
      bucket: bucket,
      key: key,
      type: bucketType,
      op: {
        map_op: {
          removes: remove
        }
      },
      return_body: true
    }, function (err, reply) {
      if (err) return callback(err);
      return callback(undefined, mapResponseToObject(reply));
    });
  }
};

exports.createClient = function (options) {
  return new riakEasy(options);
};