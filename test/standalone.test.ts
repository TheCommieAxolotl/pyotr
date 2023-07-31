import { test } from "vitest";

import { html, json, status } from "../src/aura";
import { app, route } from "../src";

const server = app(3000);

server.attach(route("/", () => html`<h1>Hello World</h1>`));
server.attach(route("/json", () => json({ hello: "world" })));

test("standalone", async (t) => {
    server.attach(
        route("/[path]", (req) => {
            t.expect(req.params).toEqual({ path: "epic" });

            return status(404);
        })
    );

    await fetch("http://localhost:3000/epic");

    t.expect(server).toBeTruthy();

    const response = await fetch("http://localhost:3000/");
    t.expect(response.status).toBe(200);

    const text = await response.text();
    t.expect(text).toBe("<h1>Hello World</h1>");

    const json = await fetch("http://localhost:3000/json");
    t.expect(json.headers.get("content-type")).toBe("application/json");

    await server.dispose();
    t.expect(await server.dispose()).toBe(false);
});
