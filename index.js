var concat = require('concat-stream');
var logfmt = require('logfmt');

require('http').createServer(function(req, res) {
  var logger = logfmt.namespace({ ns: 'http-sponge', request_id: req.headers['x-request-id'], url: req.url });

  req.pipe(concat(logRequest));
  req.on('end', end);

  function logRequest(data) {
    var logData = {
      ns: 'http-sponge',
      url: req.url,
      method: req.method
    };

    logData.headers = JSON.stringify(req.headers);
    logData.body    = data.length ? data : '{}';

    logger.log(logData);
  }

  function end() {
    res.end('ok');
  }

  function extend(target, source) {
    for (var key in source) {
      target[key] = source[key];
    }

    return target;
  }
}).listen(process.env.PORT || 5000);
