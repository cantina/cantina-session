// Module dependencies.
var sess = require('sess')
  , modeler = require('modeler-redis');

module.exports = function (app) {
  var conf;

  // Depends on cantina-web.
  app.require('cantina-web');

  // Default conf.
  app.conf.add({
    session: {
      weight: -300,
      redis: true,
      key: "sess",
      cookie: {
        httpOnly: true,
        path: '/'
      }
    }
  });

  // Get conf.
  conf = app.conf.get('session');

  if (conf) {
    // If app is using redis, save sessions there.
    if (app.redis && conf.redis) {
      app.sessions = modeler({
        name: 'sessions',
        prefix: app.redisKey('sess') + ':',
        client: app.redis
      });
      conf.sessions = app.sessions;
    }

    app.sessionHandler = sess(conf);
    app.middleware.add(conf.weight, app.sessionHandler);
  }
};