import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const missing = [];
const refs = /(?:href|src)="([^"]+)"/g;

for (const file of walk(".")) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(refs)) {
    const target = match[1];
    if (/^(https?:|mailto:|#|data:|javascript:)/.test(target)) continue;
    const cleanTarget = target.split("#")[0].split("?")[0];
    if (!cleanTarget) continue;
    const localPath = cleanTarget.startsWith("/")
      ? join(".", cleanTarget.slice(1))
      : join(dirname(file), cleanTarget);
    if (!existsSync(localPath)) {
      missing.push(`${file} -> ${target}`);
    }
  }
}

if (missing.length) {
  console.error(missing.join("\n"));
  process.exit(1);
}

console.log("Internal links OK");
