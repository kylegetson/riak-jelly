// Basic key/val functions
riak.put(bucket, key, value, opts, callback); // option can set content type, so if you want an object out, you can set the content-type
riak.get(bucket, key, callback);
riak.del(bucket, key, callback);

// CRDT data types, a bucket type is required (and must exist before these are called)
riak.incrementCounter(bucket, bucketType, key, val, callback);
riak.updateSet(bucket, bucketType, key, addItems, removeItems, callback);
riak.updateRegister(bucket, bucketType, key, object, callback);
riak.removeRegister(bucket, bucketType, key, registerArr, callback);

// get a CRDT value
riak.getMap(bucket, bucketType, key, callback);
riak.getSet(bucket, bucketType, key, callback);
riak.getCounter(bucket, bucketType, key, callback);
riak.getCRDT(bucket, bucketType, key, callback);

// the raw riakPBC client
riak.riakClient
