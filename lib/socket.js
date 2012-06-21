var cookie = require('cookie')
  , utils = require('cantina-utils')
  , parseSignedCookie = require('connect').utils.parseSignedCookie
  ;

module.exports = function(options) {
  options = options || {};

  return function(handshakeData, callback) {
    // grab the session cookie value and check the signature
    var rawCookie = cookie.parse(handshakeData.headers.cookie || "")[options.key];

    // get signedCookies for backwards compat with signed cookies
    var unsignedCookie;

    if (rawCookie) {
      unsignedCookie = parseSignedCookie(rawCookie, options.secret);
    }

    handshakeData.sessionID = unsignedCookie;

    if (!handshakeData.sessionID) {
      return callback();
    }

    options.store.load(handshakeData.sessionID, function(err, session) {
      if (err) {
        return callback(err);
      }
      handshakeData.session = session;
      callback(null, session);
    });
  };
};