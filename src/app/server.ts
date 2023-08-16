import { App } from "../types";

import https, { Server } from "node:http";

import { ANSI, log } from "../util/logger";
import { handleRequest } from "../router";

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
            ANSI.magenta
        );
        log(`Press Ctrl+C to exit process.`, ANSI.yellow);
        log("");
        log(" ROUTES ", ANSI.bg_blue, ANSI.bold);
    }

    return () => {
        return new Promise<boolean>((resolve) => {
            if (server.listening) {
                server.close(() => {
                    if (doLog) log(" SERVER CLOSED ", ANSI.bg_red);

                    resolve(true);
                });

                return;
            }

            resolve(false);
        });
    };
};
