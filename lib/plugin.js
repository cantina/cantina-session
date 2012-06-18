/**
 * Auth cantina plugin.
 */

var connect = require('connect');

// Expose this service's package info.
require('pkginfo')(module);

// The plugin is being attached to an app.
exports.attach = function(options) {
  var sessionOpts = {},
      RedisStore;

  options = options || {};

  this.utils.defaults(options, {
    secret: 'keyboard cat'
  });

  sessionOpts.secret = options.secret;

  if (options.redis) {
    RedisStore = require('connect-redis')(connect);
    sessionOpts.store = new RedisStore();
  }

  this.middleware([
    connect.cookieParser(options.secret),
    connect.bodyParser(),
    connect.session(sessionOpts),
  ]);
};
