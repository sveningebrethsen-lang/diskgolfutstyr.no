import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

const htmlFiles = walk(".");
const issues = [];
let jsonLdBlocks = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const h1Count = (html.match(/<h1\b/g) || []).length;

  if (h1Count !== 1) issues.push(`${file}: h1=${h1Count}`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) issues.push(`${file}: mangler god title`);
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) issues.push(`${file}: mangler meta description`);
  if (!/<link rel="canonical"/.test(html)) issues.push(`${file}: mangler canonical`);

  for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
      jsonLdBlocks += 1;
    } catch (error) {
      issues.push(`${file}: ugyldig JSON-LD: ${error.message}`);
    }
  }
}

for (const file of [
  "data/courses/norway.json",
  "data/products/discs.json",
  "data/products/bags.json",
  "data/products/baskets.json",
  "data/products/accessories.json"
]) {
  JSON.parse(readFileSync(file, "utf8"));
}

const sitemap = readFileSync("sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>https:\/\/diskgolfutstyr\.no\/(.*?)<\/loc>/g)].map((match) => match[1]);
for (const urlPath of urls) {
  const file = urlPath === "" ? "index.html" : urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath;
  if (!existsSync(file)) issues.push(`sitemap: ${urlPath} -> ${file} finnes ikke`);
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ htmlFiles: htmlFiles.length, jsonLdBlocks, sitemapUrls: urls.length }, null, 2));
