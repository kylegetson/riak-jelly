# riak-jelly
A wrapper around [riakpbc](https://github.com/nlf/riakpbc) to make it a bit simpler and not require knowledge of riak's protocol buffers.

**usage:**

```
var riakEasy = require('riak-jelly');
var riak = riakEasy.createClient({
  host: 'localhost',
  port: "8087"
});

riak.put('name-of-bucket', 'name-of-key', 'the value I want to store', function (err, result) {
  ...   
});
```

### Basic key/val functions

```
// option can set content type, so if you want an object, you can set the content-type
riak.put(bucket, key, value, opts, callback); 

riak.get(bucket, key, callback);
riak.del(bucket, key, callback);
```

### CRDT data types, a bucket type is required (and must exist before these are called)
```
riak.incrementCounter(bucket, bucketType, key, val, callback);
riak.decrementCounter(bucket, bucketType, key, val, callback);
riak.updateSet(bucket, bucketType, key, addItems, removeItems, callback);
riak.sadd(bucket, bucketType, key, addItems, callback);
riak.srem(bucket, bucketType, key, removeItems, callback);
riak.updateRegisters(bucket, bucketType, key, object, callback);
riak.removeRegisters(bucket, bucketType, key, registerArr, callback);
```

### get a CRDT value
```
riak.getMap(bucket, bucketType, key, callback);
riak.getSet(bucket, bucketType, key, callback);
riak.getCounter(bucket, bucketType, key, callback);
riak.getCRDT(bucket, bucketType, key, callback);
```

### the raw riakPBC client
In the event you need to do something that isnt wrapped, such as searching, or mapreduce, use ```riak.riakClient```