var assert = require('assert');

describe('sessions', function() {
  var app, request, port, base, prefix = 'cantina-session-test-' + Date.now();

  describe('memory store', function () {
    request = require('request').defaults({jar: true});
    before(createApp);
    before(function (done) {
      require('../');
      addMiddleware();
      app.start(done);
    });
    after(cleanup);
    testSessions();
  });

  describe('redis store', function () {
    request = require('request').defaults({jar: true});
    before(createApp);
    before(function (done) {
      require('cantina-redis');
      require('../');
      addMiddleware();
      app.start(done);
    });
    after(cleanup);
    testSessions();
    it('santity check for session key in redis', function (done) {
      app.redis.keys(app.redisKey('sess') + ':' + '*', function (err, keys) {
        assert.ifError(err);
        assert.equal(keys.length, 3);
        assert.notEqual(keys.indexOf(app.redisKey('sess', 'sessions') + ':'), -1);
        done();
      });
    });
  });

  function createApp (done) {
    app = require('cantina');
    app.silence();
    app.boot(function (err) {
      assert.ifError(err);
      app.conf.add({
        web: {
          server: {
            port: 0
          },
          static: false,
          views: false
        },
        redis: {
          prefix: prefix
        }
      });
      app.hook('started').add(function (next) {
        assert.ifError(err);
        port = app.server.address().port;
        base = 'http://0.0.0.0:' + port;
        next();
      });
      done();
    });
  }

  function cleanup (done) {
    if (app.redis) {
      app.redis.keys(app.redisKey('*'), function(err, key) {
        assert.ifError(err);
        app.redis.del(key, function(err) {
          assert.ifError(err);
          app.destroy(done);
        });
      });
    }
    else {
      app.destroy(done);
    }
  }

  function addMiddleware () {
    app.middleware
      .get(['/', '/session'], function (req, res, next) {
        res.json(req.session);
      })
      .post('/session', function (req, res, next) {
        Object.keys(req.body).forEach(function (k) {
          if (k.match(/^id|rev|created|updated$/i) || req.session.__proto__[k]) return;
          req.session[k] = req.body[k];
        });
        res.json(req.session);
      })
      .delete('/session', function (req, res, next) {
        req.session.destroy(function (err) {
          if (err) return next(err);
          res.send(204);
        });
      });
  }

  function testSessions () {
    it('has session, no cookie', function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        currentId = body.id;
        assert(body.created);
        done();
      });
    });
    it('sets session', function (done) {
      var vars = {a: 'ok', its: {working: true}, ok: 1};
      request({uri: base + '/session', method: 'post', json: true, body: vars}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(resp.headers['set-cookie']);
        assert.notEqual(body.id, currentId);
        currentId = body.id;
        done();
      });
    });
    it('is persistent', function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        assert.equal(body.id, currentId);
        assert(body.created);
        done();
      });
    });
    it("doesn't save on read", function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        assert.equal(body.id, currentId);
        assert.equal(body.rev, 1, 'no save unless there were changes');
        done();
      });
    });
    it('sets session', function (done) {
      var vars = {a: 'ok', its: {working: true}, ok: 1};
      request({uri: base + '/session', method: 'post', json: true, body: vars}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert.equal(body.id, currentId);
        done();
      });
    });
    it('is persistent', function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        assert.equal(body.id, currentId);
        assert.equal(body.a, 'ok');
        assert.deepEqual(body.its, {working: true});
        assert.strictEqual(body.ok, 1);
        done();
      });
    });
    it('alters', function (done) {
      var vars = {a: 'b', its: {working: true, yay: false}};
      request({uri: base + '/session', method: 'post', json: true, body: vars}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert.equal(body.id, currentId);
        assert.strictEqual(body.ok, 1);
        assert.strictEqual(body.a, 'b');
        assert.strictEqual(body.its.working, true);
        assert.strictEqual(body.its.yay, false);
        done();
      });
    });
    it('is persistent', function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        assert.equal(body.id, currentId);
        assert.strictEqual(body.ok, 1);
        assert.strictEqual(body.a, 'b');
        assert.strictEqual(body.its.working, true);
        assert.strictEqual(body.its.yay, false);
        done();
      });
    });
    it('destroys', function (done) {
      request({uri: base + '/session', method: 'delete'}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 204);
        done();
      });
    });
    it('no new session on read', function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        assert.notEqual(body.id, currentId);
        currentId = body.id;
        assert.strictEqual(body.ok, undefined);
        assert.equal(body.rev, 0);
        done();
      });
    });
    it('sets session', function (done) {
      var vars = {a: 'ok', its: {working: true}, ok: 1};
      request({uri: base + '/session', method: 'post', json: true, body: vars}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(resp.headers['set-cookie']);
        assert.notEqual(body.id, currentId);
        currentId = body.id;
        done();
      });
    });
    it('is persistent', function (done) {
      request({uri: base + '/session', json: true}, function (err, resp, body) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 200);
        assert(!resp.headers['set-cookie']);
        assert(body.id);
        assert.equal(body.id, currentId);
        assert.strictEqual(body.ok, 1);
        assert.strictEqual(body.a, 'ok');
        assert.strictEqual(body.its.working, true);
        assert.strictEqual(body.its.yay, undefined);
        done();
      });
    });
  }
});