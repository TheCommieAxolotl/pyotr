import fs from "node:fs/promises";
import path from "node:path";

import { App, UseOptions } from "../types";
import { MIME, html } from "../aura";
import { route } from "../router";

const typeFrom = (ext: string): MIME => {
    switch (ext) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "application/json";
        case ".png":
            return "image/png";
        case ".jpg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".svg":
            return "image/svg+xml";
        case ".ico":
            return "image/x-icon";
    }
};

const isDirectory = async (path: string): Promise<boolean> => {
    try {
        const stat = await fs.stat(path);

        return stat.isDirectory();
    } catch {
        return false;
    }
};

export const use = async (
    app: App,
    directory: string,
    options: UseOptions = {
        recursive: true,
        prettyUrls: true,
        guessType: true,
    },
    subpath?: string
): Promise<boolean> => {
    const files = await fs.readdir(directory);

    for (const file of files) {
        if (file.startsWith(".")) continue;

        const p = `${directory}/${file}`;

        if (await isDirectory(p)) {
            if (options.recursive) await use(app, p, options, path.dirname(p));

            continue;
        }

        let routePath = subpath ? path.join("/", subpath, file) : `/${file}`;

        let contentType = "text/plain";

        if (options.guessType) {
            contentType = typeFrom(path.extname(file));
        }

        if (options.prettyUrls && routePath.endsWith(".html")) {
            routePath = routePath.slice(0, -5);

            if (routePath.endsWith("index")) routePath = routePath.slice(0, -5);

            app.attach(route(routePath, async () => html(await fs.readFile(p, "utf-8"))));
        } else {
            app.attach(route(routePath, async () => html(await fs.readFile(p, "utf-8"))));
        }

        continue;
    }

    return true;
};
