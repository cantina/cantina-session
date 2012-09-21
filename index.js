// Module dependencies.
var app = require('cantina'),
    connect = require('connect'),
    RedisStore = require('connect-redis')(connect);

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
  conf.store.client = app.redis.client;
  session.store = new RedisStore(conf.store);

  // Add middleware.
  app.middleware.add(connect.cookieParser(conf.secret));
  app.middleware.add(connect.session(session));

  app.session = session;
});
