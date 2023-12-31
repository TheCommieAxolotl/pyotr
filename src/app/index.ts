import { App, AppDetails } from "../types";

import { Server } from "node:http";

import { ANSI, color } from "../util/logger";
import { Route } from "../router/route";
import { startServer } from "./server";
import { use } from "./use";

/**
 * Create a server instance. The resulting object can be used to attach routes or middleware.
 */
export const app = (options: number | Server, log = true): App => {
    const details: AppDetails | Server =
        typeof options === "number"
            ? {
                  port: options,
              }
            : options;

    const _routes: Set<Route> = new Set();

    const attach = (route: Route): boolean => {
        _routes.add(route);

        if (log) console.log(` - ${color(route.path, ANSI.blue)}`);

        return true;
    };

    const app = {
        details,
        _routes,
        attach,
    };

    const dispose = startServer(app, log);

    return { ...app, dispose, use: use.bind(null, app) };
};
