// Module dependencies.
var connect = require('connect'),
    RedisStore = require('connect-redis')(connect);

exports.init = function(conf, imports, register) {
  var session = conf;

  // Create session store.
  if (config.store == 'redis') {
    session.store = new RedisStore(conf.redis);
  }
  else {
    session.store = new connect.session.MemoryStore();
  }

  // Add middleware.
  imports.middler.add(connect.cookieParser(conf.secret));
  imports.middler.add(connect.session(session));

  // Register session service.
  register(null, {
    session: session
  });
};