    putPortfolioData = function(portfolioObj, dataSinkName, stockTicker, callbacks) {
      var result = []
      ;
      Object.keys(portfolioObj[stockTicker]).forEach(function(date) {
        var data = portfolioObj[stockTicker][date],
        obj = {
          stockTicker: stockTicker,
          date: date,
          totalValue: data.totalValue,
          dataFlag: data.dataFlag,
          action: data.action
        }
        ;
        if (callbacks && callbacks.rowMapper) {
          obj = callbacks.rowMapper(obj, date);
        }
        result.push(obj);
      });
      return new Promise(function (resolve, reject) {
        var filename = __dirname + configMap.fsDataSinkPrefix + dataSinkName,
        writer = csvStream(),
        ws = fs.createWriteStream(filename)
        ;

        writer.on('error', function(error) {
          reject(error);
        });

        ws.on('finish', function() {
          fs.appendFileSync(filename, '### FILE WRITE COMPLETED AT ' + (new Date()).toString() + ' ###\n');
          resolve(filename);
        });

        writer.pipe(ws);

        if (callbacks && callbacks.commentsProducer) {
          var comments = callbacks.commentsProducer();
          ws.write('### START COMMENTS ###\n');
          ws.write(comments + '\n');
          ws.write('### END COMMENTS ###\n');
        }
        result.forEach(function(obj) {
          writer.write(obj);
        });
        writer.end();
      });
    };
