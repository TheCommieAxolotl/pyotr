import { html, json, status } from "../dist/aura.js";
import { app, route } from "../dist/index.js";

const server = app(3000);

server.attach(route("/", () => html`<h1>Hello World</h1>`));
server.attach(route("/json", () => json({ hello: "world" })));

server.attach(
    route("/path/[e]", (e) => {
        return json(e);
    })
);

server.attach(
    route("/[...404]", () => {
        return status(404);
    })
);
