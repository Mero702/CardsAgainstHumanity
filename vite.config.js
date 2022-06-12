import { defineConfig } from "vite";
import {VitePluginNode} from 'vite-plugin-node'
import eslint from "vite-plugin-eslint";

export default defineConfig({
    server: {
        port: 3000
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/server.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild',
            tsConfig: './tsconfig.json',
        }),
    ]
})