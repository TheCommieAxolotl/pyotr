import { Server } from "node:http";
import { Route } from "~/router";

export interface AppDetails {
    /**
     * The port to listen on.
     */
    port: number;
}

export interface App {
    /**
     * Details about the server.
     */
    details: AppDetails | Server;
    _routes: Set<Route>;

    /**
     * Attach a route provider to the app.
     *
     * @example
     * app(...).attach(route("/myroute", () => {}));
     */
    attach: (route: Route) => boolean;

    /**
     * Dispose of the app and stop listening.
     */
    dispose: () => Promise<boolean>;
}
