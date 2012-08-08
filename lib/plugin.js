/**
 * Auth cantina plugin.
 */

var connect = require('connect')
  , utils = require('cantina-utils')

// Expose this service's package info.
utils.pkginfo(module);

// The plugin is being attached to an app.
exports.attach = function(options) {
  options = options || {};

  this.utils.defaults(options, {
    secret: 'keyboard cat',
    key: 'connect.sid'
  });

  this.session = {secret: options.secret, key: options.key};

  if (options.redis) {
    var RedisStore = require('connect-redis')(connect);
    this.session.store = new RedisStore(typeof options.redis == 'object' ? options.redis : {});
  }
  else {
    this.session.store = new connect.session.MemoryStore();
  }

  this.middleware([
    connect.cookieParser(this.session.secret),
    connect.session(this.session)
  ]);

  this.utils.defaults(this.session, require('./socket')(this.session));
};
