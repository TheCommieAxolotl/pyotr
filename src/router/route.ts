import { IncomingMessage } from "http";
import { ResponseData } from "../aura";

type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "update";

export interface PyotrRequest {
    request: IncomingMessage;
    params: Record<string, string>;
    query: Record<string, string>;
    method: Method;
    path: string;
}

export type Route = {
    path: string;
    method: Method | Method[];
    handler: (request: PyotrRequest) => ResponseData | Promise<ResponseData>;

    /**
     * Update the handler for this route.
     */
    update: (handler: Route["handler"]) => void;
};

/**
 * Create a route provider to be passed to `app.attach()`.
 *
 * @example
 * const myRoute = route(
 *     "/myroute",
 *     () => html`<h1>Hello, world!</h1>`
 * );
 */
export const route = (path: Route["path"], handler: Route["handler"], method?: Route["method"]): Route => {
    const self: Partial<Route> = {
        path,
        method: method || "get",
        handler,
    };

    self.update = (handler: Route["handler"]) => {
        self.handler = handler;
    };

    return self as Route;
};
