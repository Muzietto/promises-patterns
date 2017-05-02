    // start connection and load stateMap.json
    var initModule = function(options) {
      options = options || {};
      return fsModule.initModule(options)
        .then(function(value) {
          return client.connect(configMap.dbDataSourcePrefix);
        })
        .then(function(db) {
          stateMap.db = db;
          return Promise.resolve(db);
        })
        .catch(function (err) { _log(err); })
        .then(function(db) {
          if (options.bulkUploadDb && options.jsonArchive) {
            return bulkJsonUpload(options.jsonArchive, options.keepExistingCollections)
              .then(function() { return Promise.resolve(db); });
          } else {
            return Promise.resolve(db);
          }
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'items', '_item');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'itemsets', '_itemset');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'conditions', '_condition');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'consequences', '_consequence');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'booleans', '_booleans');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'rules', '_rule');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'pricelists', '_pricelist');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'context', '_context');
        })
        .then(function(db) {
          return jsonLoadingPromise(db, 'portfolios', '_portfolio');
        })
        ;
      function jsonLoadingPromise(db, collectionName, jsonArrayName) {
        return db.collection(collectionName).find({}).toArray()
        .then(function(array) {
          stateMap.json[jsonArrayName] = array;
          return Promise.resolve(db);
        });
      }
    };
