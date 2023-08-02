import { test } from "vitest";

import { createServer } from "http";

import { html, json, status, redirect } from "../src/aura";
import { app, route } from "../src";

const myOwnServer = createServer();

myOwnServer.listen(4000);

const server = app(myOwnServer);

const index = route("/", () => html`<h1>Hello World</h1>`);

server.attach(index);
server.attach(route("/json", () => json({ hello: "world" })));
server.attach(route("/redirect", () => redirect("/")));

test("byos", async (t) => {
    server.attach(
        route("/[path]", (req) => {
            // passes params to the handler
            t.expect(req.params).toEqual({ path: "epic" });

            return status(404);
        })
    );

    await fetch("http://localhost:4000/epic");

    // server is a Server instance
    t.expect(server).toBeTruthy();

    // redirects work
    const redirect = await fetch("http://localhost:4000/redirect");
    t.expect(redirect.redirected).toBe(true);

    // response sends accurate status codes
    const response = await fetch("http://localhost:4000/");
    t.expect(response.status).toBe(200);

    // response sends accurate content
    const text = await response.text();
    t.expect(text).toBe("<h1>Hello World</h1>");

    // response sends accurate MIME types
    const json = await fetch("http://localhost:4000/json");
    t.expect(json.headers.get("content-type")).toBe("application/json");

    // updating a route works
    index.update(() => html`<h1>Goodbye World</h1>`);

    const newRes = await (await fetch("http://localhost:4000/")).text();
    t.expect(newRes).toBe("<h1>Goodbye World</h1>");

    // disposing of a server works
    await server.dispose();
    t.expect(await server.dispose()).toBe(false);
});
