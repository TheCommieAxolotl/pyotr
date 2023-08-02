import { Route } from "./router/route";
import { Server } from "node:http";

export interface UseOptions {
    /**
     * Whether to recursively search the directory.
     */
    recursive: boolean;
    /**
     * Whether to use pretty URLs. (e.g. /myroute instead of /myroute.html)
     */
    prettyUrls: boolean;
    /**
     * Whether to guess the MIME type of the file.
     */
    guessType: boolean;
}

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
     * Use a directory's files as routes.
     *
     * @example
     * app(...).use(join(__dirname, "assets"));
     */
    use: (directory: string, options?: Partial<UseOptions>) => Promise<boolean>;

    /**
     * Dispose of the app and stop listening.
     */
    dispose: () => Promise<boolean>;
}
