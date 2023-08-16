<p align="center">
    <a href="https://www.npmjs.com/package/pyotr" target="__blank">
        <img src="https://img.shields.io/npm/v/pyotr?style=flat&colorA=171717&colorB=efd94e" alt="Version">
    </a>
    <a href="https://www.npmjs.com/package/pyotr" target="__blank">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/pyotr?style=flat&colorA=171717&colorB=efd94e">
    </a>
    <a>
        <img alt="Bundle" src="https://img.shields.io/bundlephobia/minzip/pyotr?style=flat&label=Bundle%20Size&labelColor=%23171717&color=%23efd94e">
    </a>
    <a href="https://github.com/TheCommieAxolotl/pyotr" target="__blank">
        <img alt="Stars" src="https://img.shields.io/github/stars/TheCommieAxolotl/pyotr?style=flat&colorA=171717&colorB=efd94e">
    </a>
</p>

---

Want to test it out? Check out the [Hello World example](https://stackblitz.com/edit/pyotr?file=index.js)!

---

# Pyotr
A tiny (< 2kb gzipped) 0-dependency HTTP wrapper with inbuilt routing and middleware support.

## Use
To instantiate a new Pyotr server, simply use `app`:
```ts
import http from "http";

import { app } from "pyotr";

const server = app(3000); // you can specify a port for local development
const server = app(http.createServer()); // you can also use an existing server
```

To add a route, use `app.attach` with a route provider:
```ts
import { app, route } from "pyotr";
import { html } from "pyotr/aura";

const server = app(3000);

server.attach(route("/", () => html`<h1>Hello, world!</h1>`));
```

If you want to use a whole directory as routes, instead of adding them one by one, you can use `app.use`:
```ts
import { app } from "pyotr";

const server = app(3000);

const useOptions = {
    recursive: true, // whether to recursively attach directories
    prettyUrls: true, // whether or not to use pretty URLs (e.g. /about instead of /about.html)
    guessTypes: true, // guess the MIME type of files (e.g. text/css for .css files)
};

server.use(resolve("./routes"), useOptions);
```

### Route Handlers
Route handlers are functions that are called when a request is made to a route. They are passed a [`PyotrRequest`]("https://github.com/TheCommieAxolotl/pyotr/blob/main/src/router/route.ts#L6-L12") object and may return a subset of Response options.

```ts
import { app, route } from "pyotr";

const server = app(3000);

server.attach(route("/", (req) => {
    const { request, method, path, query, params } = req;

    return {
        type: string, // MIME type
        content: string,
        status: number, // HTTP status code
        redirect: string, // redirect URL (should also set status to 302)
        headers: Record<string, string>
    };
}));
```

You can also update an existing route's handler by calling `route.update`:
```ts
const myRoute = route(...)

server.attach(myRoute);

myRoute.update((req) => {
    // ...
});
```