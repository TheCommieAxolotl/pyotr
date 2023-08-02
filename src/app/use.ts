import fs from "node:fs/promises";
import path from "node:path";

import { App, UseOptions } from "../types";
import { route } from "../router";
import * as aura from "../aura";

const typeFrom = (
    ext: string
): typeof aura.html | typeof aura.css | typeof aura.js | typeof aura.json | typeof aura.png | typeof aura.jpg => {
    switch (ext) {
        case ".html":
            return aura.html;
        case ".css":
            return aura.css;
        case ".js":
            return aura.js;
        case ".json":
            return aura.json;
        case ".png":
            return aura.png;
        case ".jpg":
        case ".jpeg":
            return aura.jpg;
        default:
            return aura.text;
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

        let contentType = aura.text;

        if (options.guessType) {
            contentType = typeFrom(path.extname(file));
        }

        if (options.prettyUrls && routePath.endsWith(".html")) {
            routePath = routePath.slice(0, -5);

            if (routePath.endsWith("index")) routePath = routePath.slice(0, -5);

            app.attach(route(routePath, async () => contentType(await fs.readFile(p, "utf-8"))));
        } else {
            app.attach(route(routePath, async () => contentType(await fs.readFile(p, "utf-8"))));
        }

        continue;
    }

    return true;
};
