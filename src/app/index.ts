import { App, AppDetails } from "../types";

import { Server } from "node:http";

import { startServer } from "./server";
import { color } from "../util/logger";
import { Route } from "../router";

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

        if (log)
            console.log(
                ` - ${color(route.path, "blue")}${
                    route.method.toUpperCase() !== "GET" ? ` (${route.method.toUpperCase()})` : ""
                }`
            );

        return true;
    };

    const app: Partial<App> = {
        details,
        _routes,
        attach,
    };

    const dispose = startServer(app, log);

    return { ...app, dispose } as App;
};
