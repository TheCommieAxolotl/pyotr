import { html, json, status } from "../dist/aura.js";
import { app, route } from "../dist/index.js";

const server = app(3000);

server.attach(route("/", () => html`<h1>Hello World</h1>`));
server.attach(route("/json", () => json({ hello: "world" })));

server.attach(
    route("/[path]", () => {
        return status(404);
    })
);
