import { existsSync, readFileSync, writeFileSync } from "node:fs";

const configPath = ".vercel/output/config.json";

if (existsSync(configPath)) {
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const headerRoutes = Array.isArray(config.routes)
    ? config.routes.filter((route) => route.headers && route.src)
    : [];

  config.routes = [...headerRoutes, { handle: "filesystem" }, { src: "/(.*)", dest: "/__server" }];

  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}
