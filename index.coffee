http = require 'http'

server = http.createServer (req, res) ->
  buffer = ''

  req.on 'data', (data) ->
    buffer += data

  req.on 'end', ->
    console.log buffer.toString()
    res.end 'thanks'

server.listen process.env.PORT
