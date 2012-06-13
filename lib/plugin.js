/**
 * Auth cantina plugin.
 */

var connect = require('connect');

// Expose this service's package info.
require('pkginfo')(module);

// The plugin is being attached to an app.
exports.attach = function(options) {
  options = options || {};

  this.utils.defaults(options, {
    secret: 'keyboard cat'
  });

  this.middleware([
    connect.cookieParser(options.secret),
    connect.bodyParser(),
    connect.session({secret: options.secret}),
  ]);
};
