var cookie = require('cookie')
  , utils = require('cantina-utils')
  , parseSignedCookie = require('connect').utils.parseSignedCookie
  ;

exports.fromSocket = function(options) {
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

exports.fromEngineSocket = function(options) {
  options = options || {};

  return function(socket, callback) {
    if (!socket || !socket.transport || !socket.transport.headers) {
      return callback(new Error('no transport headers to use with handshake'));
    }
    socket.handshake || (socket.handshake = {});
    // grab the session cookie value and check the signature
    var rawCookie = cookie.parse(socket.transport.request.headers.cookie || "")[options.key];

    // get signedCookies for backwards compat with signed cookies
    var unsignedCookie;

    if (rawCookie) {
      unsignedCookie = parseSignedCookie(rawCookie, options.secret);
    }

    socket.handshake.sessionID = unsignedCookie;

    if (!socket.handshake.sessionID) {
      return callback();
    }

    options.store.load(socket.handshake.sessionID, function(err, session) {
      if (err) {
        return callback(err);
      }
      socket.handshake.session = session;
      callback(null, session);
    });
  };
};