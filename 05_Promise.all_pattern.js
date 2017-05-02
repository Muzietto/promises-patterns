    function bulkJsonUpload(jsonData, keepExistingCollections) {
      var mappings = {
        '_context': 'context',
        '_item': 'items',
        '_itemset': 'itemsets',
        '_condition': 'conditions',
        '_consequence': 'consequences',
        '_booleans': 'booleans',
        '_pricelist': 'pricelists',
        '_portfolio': 'portfolios',
        '_rule': 'rules'
      },
      sgnippam = {
        'context': '_context',
        'items': '_item',
        'itemsets': '_itemset',
        'conditions': '_condition',
        'consequences': '_consequence',
        'booleans': '_booleans',
        'pricelists': '_pricelist',
        'portfolios': '_portfolio',
        'rules': '_rule'
      },
      startPromise = Promise.resolve()
      ;
      if (!keepExistingCollections) startPromise = dropCollections(configMap.dbDataSourcePrefix);

      return startPromise.then(function() {
        return Promise.all(Object.keys(jsonData)
        .map(function(name) { return mappings[name]; })
        .map(bulkCollectionUploadPromise));
      });
      function bulkCollectionUploadPromise(collectionName) {
        return Promise.all(jsonData[sgnippam[collectionName]]
          .map(function(jsonObj) {
            return saveJson(collectionName, jsonObj);
          }));
      }
    }
