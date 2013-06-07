// Module dependencies.
var app = require('cantina'),
    connect = require('connect'),
    RedisStore = require('connect-redis')(connect);

// we need app.redis
require('cantina-redis');

app.conf.add({
  session: {
    secret: "keyboard cat",
    key: "connect.sid",
    store: {
      prefix: 'cantina:session:'
    }
  }
});

app.on('init', function(){
  var conf = app.conf.get('session');
  var session = conf;

  // Create session store.
  conf.store.client = app.redis;
  session.store = new RedisStore(conf.store);

  // connect.session requires this modification to req:
  app.middleware.first(function (req, res, next) {
    req.originalUrl = req.originalUrl || req.url;
    next();
  });

  // Add middleware.
  app.middleware.add(connect.cookieParser(conf.secret));
  app.middleware.add(connect.session(session));

  app.session = session;
});
