var concat = require('concat-stream');
var logfmt = require('logfmt');

require('http').createServer(function(req, res) {
  var logger = logfmt.namespace({ ns: 'http-sponge', request_id: req.headers['x-request-id'], url: req.url });

  req.pipe(concat(logRequest));
  req.on('end', end);

  function logRequest(data) {
    data = data.length ? data : '{}';

    logger.log({ at: 'metadata', method: req.method });
    logger.log(extend({ at: 'headers' }, req.headers));
    logger.log(extend({ at: 'body-parsed' }, JSON.parse(data)));
    logger.log({ at: 'body-json', body: data });
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
