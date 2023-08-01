import type { IncomingMessage, ServerResponse } from "node:http";
import { App } from "../types";

export { route } from "./route";
import { Route } from "./route";

const _DATE = Date.now();

const bail = (response: ServerResponse<IncomingMessage>, status: number) => {
    response.statusCode = status;
    response.end();
};

const matchRoute = (req: IncomingMessage, route: Route): boolean => {
    const pathParts = req.url.split("/");
    const routeParts = route.path.split("/");

    if (!Array.isArray(route.method)) {
        route.method = [route.method];
    }

    let pathMatches = true;
    let methodMatches = true;

    if (!route.method.includes(req.method.toLowerCase() as Parameters<Route["handler"]>[0]["method"])) {
        methodMatches = false;
    }

    if (!route.path.includes("[...") && pathParts.length !== routeParts.length) {
        pathMatches = false;

        return pathMatches && methodMatches;
    }

    for (let i = 0; i < pathParts.length; i++) {
        if (routeParts[i] === undefined) {
            pathMatches = false;

            break;
        }

        if (routeParts[i].startsWith("[...") && routeParts[i].endsWith("]")) {
            pathMatches = true;
            break;
        }

        if (routeParts[i].startsWith("[") && routeParts[i].endsWith("]")) {
            continue;
        }

        if (routeParts[i] !== pathParts[i]) {
            pathMatches = false;

            break;
        }
    }

    return pathMatches && methodMatches;
};

const getParams = (req: IncomingMessage, route: Route): Record<string, string> => {
    const pathParts = req.url.split("/");
    const routeParts = route.path.split("/");
    const params: Record<string, string> = {};

    for (let i = 0; i < pathParts.length; i++) {
        if (routeParts[i].startsWith("[...") && routeParts[i].endsWith("]")) {
            params[routeParts[i].slice(4, -1)] = pathParts.slice(i).join("/");

            break;
        }

        if (routeParts[i].startsWith("[") && routeParts[i].endsWith("]")) {
            params[routeParts[i].slice(1, -1)] = pathParts[i];
        }
    }

    return params;
};

const getQuery = (req: IncomingMessage): Record<string, string> => {
    const hasQuery = req.url.includes("?");

    if (!hasQuery) return {};

    const query = req.url.split("?")[1];
    const queryParts = query.split("&");
    const params: Record<string, string> = {};

    for (const part of queryParts) {
        const [key, value] = part.split("=");

        params[key] = value;
    }

    return params;
};

export const handleRequest = async (
    app: App,
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
        req: IncomingMessage;
    }
) => {
    const route = Array.from(app._routes).find((route) => matchRoute(request, route));

    response.setHeader("X-Pyotr-Canonical", Date.now() - _DATE);

    if (!route) return bail(response, 404);

    const responseData = await route.handler({
        request,
        params: getParams(request, route),
        query: getQuery(request),
        path: request.url,
        method: request.method.toLowerCase() as Parameters<Route["handler"]>[0]["method"],
    });

    if (!responseData) return bail(response, 500);

    if (responseData.headers) {
        for (const [key, value] of Object.entries(responseData.headers)) {
            response.setHeader(key, value);
        }
    }

    if (responseData.redirect) {
        response.writeHead(responseData.status || 302, { Location: responseData.redirect });
        response.end();

        return;
    }

    if (responseData.status) response.writeHead(responseData.status, { "Content-Type": responseData.type });
    if (responseData.content) response.end(responseData.content);
};
