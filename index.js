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

    var body = JSON.parse(data.length ? data : '{}');

    for (var key in req.headers) {
      logData['http_sponge_header_' + key] = req.headers[key];
    }

    for (var key in body) {
      logData['http_sponge_body_' + key] = body[key];
    }

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
