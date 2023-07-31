<p align="center">
    <a href="https://www.npmjs.com/package/pyotr" target="__blank">
        <img src="https://img.shields.io/npm/v/pyotr?style=flat&colorA=002438&colorB=58b56b" alt="Version">
    </a>
    <a href="https://www.npmjs.com/package/pyotr" target="__blank">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/pyotr?style=flat&colorA=002438&colorB=58b56b">
    </a>
    <a href="https://github.com/TheCommieAxolotl/pyotr" target="__blank">
        <img alt="Stars" src="https://img.shields.io/github/stars/TheCommieAxolotl/pyotr?style=flat&colorA=002438&colorB=58b56b">
    </a>
</p>

# Pyotr
A tiny (< 2kb gzipped) HTTP wrapper with inbuilt routing and middleware support.

## Use
To instanciate a new Pyotr server, simply use `app`:
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

