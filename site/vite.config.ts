import { defineConfig, createServer, type Plugin, type ResolvedConfig } from "vite";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const base = process.env.BASE_PATH || "/";

/**
 * Writes one static HTML file per route with its markup already rendered, then the client takes over. Each page
 * also modulepreloads its own view chunk and that chunk's imports: the router imports the view on boot, and
 * without the hint that request only starts once the entry has run, a full extra round trip on a phone.
 */
function prerenderPlugin(): Plugin {
  let config: ResolvedConfig;
  const viewFiles = new Map<string, string[]>();
  return {
    name: "prerender",
    apply: "build",
    configResolved: (c) => void (config = c),
    generateBundle(_, bundle) {
      const chunks = new Map(Object.values(bundle).flatMap((c) => (c.type === "chunk" ? [[c.fileName, c] as const] : [])));
      const closure = (file: string, seen = new Set<string>()): Set<string> => {
        if (seen.has(file)) return seen;
        seen.add(file);
        chunks.get(file)?.imports.forEach((f) => closure(f, seen));
        return seen;
      };
      for (const c of chunks.values()) {
        const kind = c.facadeModuleId?.match(/\/src\/views\/(\w+)\.ts$/)?.[1];
        if (kind) viewFiles.set(kind, [...closure(c.fileName)]);
      }
    },
    async closeBundle() {
      const outDir = config.build.outDir;
      const shell = readFileSync(resolve(outDir, "index.html"), "utf8");
      const server = await createServer({ root, configFile: false, appType: "custom", server: { middlewareMode: true }, logLevel: "error" });
      try {
        const mod = await server.ssrLoadModule("/src/templates/routes.ts");
        const pages = mod.prerender(base) as { path: string; kind: string; title: string; description: string; html: string }[];
        for (const page of pages) {
          const preload = (viewFiles.get(page.kind) ?? [])
            .filter((f) => !shell.includes(f))
            .map((f) => `<link rel="modulepreload" crossorigin href="${base}${f}">`)
            .join("");
          const file = resolve(outDir, page.path);
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(
            file,
            shell
              .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
              .replace(/(<meta name="description" content=")[^"]*/, `$1${page.description}`)
              .replace("<!--chrome-->", mod.chrome(base))
              .replace("<!--app-->", page.html)
              .replace("</head>", `${preload}</head>`),
          );
        }
      } finally {
        await server.close();
      }
    },
  };
}

export default defineConfig({
  base,
  plugins: [prerenderPlugin()],
  server: { port: 5176 },
  preview: { port: 4176 },
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    /* The Behance decks are local working files (gitignored): build each one only where it exists */
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries({
          main: "index.html",
          press: "behance/social-content-tool/index.html",
          armoriq: "behance/armoriq-platform/index.html",
        })
          .map(([k, f]) => [k, resolve(root, f)])
          .filter(([, f]) => existsSync(f)),
      ),
    },
  },
});
