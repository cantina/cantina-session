cantina-session
===============

Provides [sess](https://github.com/carlos8f/sess) middleware for [Cantina](https://github.com/cantina/cantina) applications.

Dependencies
------------
- [cantina-web](https://github.com/cantina/cantina-web)

Provides
--------
- **app.sessionHandler** - Session middleware.
- **app.sessions** - (If cantina-redis is loaded) [Modeler](https://github.com/carlos8f/modeler) collection of sessions.

Adds Middleware
---------------
- **app.sessionHandler**

Configuration
-------------
- **weight** - Session middleware weight.
- **redis** - By default, if `app.redis` exists `cantina-session` will use redis
              for sessions. If you want to force in-memory session even though
              the app uses redis, set this to `false`.
- **cookie** - Cookie settings (see `sess` docs)

**Defaults**

```js
{
  session: {
    weight: -300,
    redis: true,
    key: "sess",
    cookie: {
      httpOnly: true,
      path: '/'
    }
  }
}
```

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.
