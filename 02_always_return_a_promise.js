    // performs also initialisation i.e. returns a promise
    var configModule = function (options) {
      /* jslint validthis: true */
      var dataConfig = {}, // data to configure the DATA module
      promiseToBeReturned,
      self = this
      ;
      options = options || {};
      options.CONTEXT = options.CONTEXT || {};
      options.PORTFOLIO = options.PORTFOLIO || {};

      // data submodule
      // wiring of the parameters for the data module
      [
        'apiModuleFilename',
        'dbDataSourcePrefix',
        'dbDataSinkPrefix',
        'fsDataSourcePrefix',
        'fsDataSinkPrefix'
      ].forEach(function(paramName) {
        if (options[paramName]) dataConfig[paramName] = options[paramName];
      });

      data.configModule(dataConfig); // synchronous

      if (options.noMultipleDataInit && data.RUNTIME._item.length > 0) {
        promiseToBeReturned = Promise.resolve();
      } else {
        // load runtime data from db/fs - returns a promise
        promiseToBeReturned = data.initModule(options);
      }

      return promiseToBeReturned
        .then(function(value) {
          configMap.runtime = data.RUNTIME;  // runtime for the whole page comes from DATA
          configMap.dataAPI = data.API;

          // optional - load context from DB
          // TODO - drive next 'if' through an options.contextFromDb flag
          if (Object.keys(options.CONTEXT).length > 0) {
            CONTEXT.setContextMap(options.CONTEXT);
          } else {
            stateMap.context = configMap.runtime._context[0]; // initialized by data.initModule
          }

          // optional - load current portfolio from DB
          if (options.portfolioFromDb) {
            // TODO - put here portfolio selection through config options
            stateMap.portfolio = configMap.runtime._portfolio[0]; // initialized by data.initModule
          } else {
            stateMap.portfolio = _clone(options.PORTFOLIO);
          }

          // historical submodule
          HISTORICAL.configModule(options);

          // handlers submodule
          handlers.configModule({ MODEL: self });
          RUNTIME.decorateObjects();

          return HISTORICAL.initModule(options);
        });
    };
