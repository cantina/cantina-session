// Module dependencies.
var connect = require('connect'),
    RedisStore = require('connect-redis')(connect),
    cookie = require('cookie'),
    parseSignedCookie = require('connect').utils.parseSignedCookie;

exports.init = function(conf, imports, register) {
  var session = conf;

  // Create session store.
  session.store = new RedisStore(conf.redis);

  // Add middleware.
  imports.middler.add(connect.cookieParser(conf.secret));
  imports.middler.add(connect.session(session));

  // Expose socket session support.
  session.fromSocket = exports.fromSocket(session);
  session.fromEngineSocket = exports.fromEngineSocket(session);

  // Register session service.
  register(null, {
    session: session
  });
};

exports.fromSocket = function(session) {
  session = session || {};

  return function(handshakeData, callback) {
    // grab the session cookie value and check the signature
    var rawCookie = cookie.parse(handshakeData.headers.cookie || "")[session.key];

    // get signedCookies for backwards compat with signed cookies
    var unsignedCookie;

    if (rawCookie) {
      unsignedCookie = parseSignedCookie(rawCookie, session.secret);
    }

    handshakeData.sessionID = unsignedCookie;

    if (!handshakeData.sessionID) {
      return callback();
    }

    session.store.load(handshakeData.sessionID, function(err, session) {
      if (err) {
        return callback(err);
      }
      handshakeData.session = session;
      callback(null, session);
    });
  };
};

exports.fromEngineSocket = function(session) {
  session = session || {};

  return function(socket, callback) {
    if (!socket || !socket.transport || !socket.transport.headers) {
      return callback(new Error('no transport headers to use with handshake'));
    }
    socket.handshake || (socket.handshake = {});
    // grab the session cookie value and check the signature
    var rawCookie = cookie.parse(socket.transport.request.headers.cookie || "")[session.key];

    // get signedCookies for backwards compat with signed cookies
    var unsignedCookie;

    if (rawCookie) {
      unsignedCookie = parseSignedCookie(rawCookie, session.secret);
    }

    socket.handshake.sessionID = unsignedCookie;

    if (!socket.handshake.sessionID) {
      return callback();
    }

    session.store.load(socket.handshake.sessionID, function(err, session) {
      if (err) {
        return callback(err);
      }
      socket.handshake.session = session;
      callback(null, session);
    });
  };
};