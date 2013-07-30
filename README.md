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
strategy firm located in Aptos, CA and Washington, D.C.

- - -
### License: MIT
Copyright (C) 2013 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
