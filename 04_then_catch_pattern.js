   function saveJson(type, data) {
      return stateMap.db.collection(type).save(util.deepClone(data))
        .then(function(value) {
          _log('--> saved ' + type + ': ' + JSON.stringify(value.ops), 'DEBUG');
          return Promise.resolve(value);
        })
        .catch(function (err) { _log(err, 'ERROR'); });
    }
