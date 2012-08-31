cantina-session
===============

[connect-session](http://www.senchalabs.org/connect/middleware-session.html) plugin for [Cantina](https://github.com/cantina/cantina)

Dependencies
------------
- **middleware** - An middler stack provided by [cantina-middler](https://github.com/cantina/cantina-middler)
- **redis** - A redis client provided by [cantina-redis](https://github.com/cantina/cantina-redis/tree/1.x)

Provides
--------
- **app.session** - Session configuration and handlers.
  - **app.session.fromSocket**
  - **app.session.fromEngineSocket**

Adds Middleware
---------------
- **connect.cookieParser**
- **connect.session**

Configuration
-------------
- **secret** - Sessin secret
- **key** - Session key
- **store** - Options for the RedisStore

**Defaults**
```js
{
  secret: "keyboard cat",
  key: "connect.sid",
  store: {
    prefix: 'cantina'
  }
}
```

Example
-------
```js
var cantina = require('cantina'),
    plugins = ['http', 'middleware', 'cantina-session'],
    conf = { http: { port: 3000 } };

cantina.createApp(plugins, conf, function(err, app) {
  if (err) return console.log(err);
});
```

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -
### License: MIT
Copyright (C) 2012 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

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
