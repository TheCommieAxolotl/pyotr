import { builtinModules } from "node:module";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

import { defineConfig } from "vite";

import tsconfig from "vite-plugin-tsconfig-paths";
import terser from "@rollup/plugin-terser";
import dts from "vite-plugin-dts";

const IS_DEV = process.env.npm_lifecycle_event === "dev";

let i = 0;

export default defineConfig({
    build: {
        lib: {
            entry: [path.resolve(__dirname, "src/index.ts"), path.resolve(__dirname, "src/aura/index.ts")],
            formats: ["es", "cjs"],
            fileName: (format) => {
                i++;

                return `${i % 2 === 0 ? "index" : "aura"}.${format == "es" ? "js" : format}`;
            },
        },
        outDir: "dist",
        rollupOptions: {
            external: ["node:http", ...builtinModules],
            plugins: [!IS_DEV && terser({})].filter(Boolean),
        },
    },
    plugins: [
        dts({
            exclude: ["test/**/*"],
        }),
        tsconfig(),
    ],
});
