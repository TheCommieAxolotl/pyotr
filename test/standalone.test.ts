import { test } from "vitest";

import { html, json, status } from "../src/aura";
import { app, route } from "../src";

const server = app(3000);

const index = route("/", () => html`<h1>Hello World</h1>`);

server.attach(index);
server.attach(route("/json", () => json({ hello: "world" })));

test("standalone", async (t) => {
    server.attach(
        route("/[path]", (req) => {
            // passes params to the handler
            t.expect(req.params).toEqual({ path: "epic" });

            return status(404);
        })
    );

    await fetch("http://localhost:3000/epic");

    // server is a Server instance
    t.expect(server).toBeTruthy();

    // response sends accurate status codes
    const response = await fetch("http://localhost:3000/");
    t.expect(response.status).toBe(200);

    // response sends accurate content
    const text = await response.text();
    t.expect(text).toBe("<h1>Hello World</h1>");

    // response sends accurate MIME types
    const json = await fetch("http://localhost:3000/json");
    t.expect(json.headers.get("content-type")).toBe("application/json");

    // updating a route works
    index.update(() => html`<h1>Goodbye World</h1>`);

    const newRes = await (await fetch("http://localhost:3000/")).text();
    t.expect(newRes).toBe("<h1>Goodbye World</h1>");

    // disposing of a server works
    await server.dispose();
    t.expect(await server.dispose()).toBe(false);
});
