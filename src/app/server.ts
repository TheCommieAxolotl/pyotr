import { App } from "../types";

import https, { Server } from "node:http";

import { handleRequest } from "../router";
import { log } from "../util/logger";

export const startServer = (app: Partial<App>, doLog = true) => {
    let server: Server;

    if (app.details instanceof https.Server) {
        server = app.details;
    } else {
        server = https.createServer();
    }

    server.on("request", (request, response) => handleRequest(app as App, request, response));

    if (app.details["port"]) {
        server.listen(app.details["port"]);
    }

    if (doLog) {
        log(
            `Listening${app.details["port"] ? ` on http://localhost:${app.details["port"]}/` : " to Server"}`,
            "magenta"
        );
        log(`Press Ctrl+C to exit process.`, "yellow");
        log("");
        log("Page Routes", "bold");
    }

    return () => {
        return new Promise<boolean>((resolve) => {
            if (server.listening) {
                server.close(() => {
                    if (doLog) log("Server closed.", "red");

                    resolve(true);
                });

                return;
            }

            resolve(false);
        });
    };
};
