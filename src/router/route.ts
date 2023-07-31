import { IncomingMessage } from "http";
import { ResponseData } from "../aura";

type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "update";

export interface PyotrRequest {
    request: IncomingMessage;
    params: Record<string, string>;
    query: Record<string, string>;
    path: string;
}

export type Route = {
    path: string;
    method: Method;
    handler: (request: PyotrRequest) => ResponseData | Promise<ResponseData>;
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
export const route = (path: Route["path"], handler: Route["handler"], method?: Route["method"]): Route => ({
    path,
    method: method || "get",
    handler,
});
