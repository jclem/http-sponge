# http-sponge

Listen for requests of any type and log request body and metadata to standard
out.

## Install

```sh
$ git clone git@github.com:jclem/http-sponge.git
$ cd http-sponge
$ npm install
$ npm start
```

## Deploy to Heroku

```sh
$ hk create
$ git push heroku master
```

## Usage

http-sponge is useful when you need to deal with callbacks that happen on an
external server that obviously can't send requests to your local apps in
development.

Tell your app to direct callback requests at your instance of `http-sponge` on
heroku. http-sponge will log your requests in a key-value format which can be
parsed by the `bin/mop` script. `bin/mop` accepts a string to match URLs against
(you might want to add UUIDs to your callback URL in some way to identify the
requests you want forwarded via grep), and a port to forward requests to on your
localhost:

```sh
$ hk log | grep --line-buffered my-route-to-forward | bin/mop 5000
```

Now, requests that your non-local app make to your instance of http-sponge will
be forwarded along to your local app.

## Limits

`bin/mop` forwards the following:

- Request URL
- Headers (the `host` header is removed)
- Method
- Body (only JSON is supported)
