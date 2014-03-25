var concat = require('concat-stream');
var logfmt = require('logfmt');

require('http').createServer(function(req, res) {
  var logger = logfmt.namespace({ ns: 'http-sponge', request_id: req.headers['x-request-id'], url: req.url });

  req.pipe(concat(function(data) {
    var logData = {
      ns: 'http-sponge',
      url: req.url,
      method: req.method
    };

    logData.headers = JSON.stringify(req.headers);
    logData.body    = data.length ? data : '{}';

    logger.log(logData);
  }));

  req.on('end', function() {
    res.end('ok');
  });
}).listen(process.env.PORT || 5000);
