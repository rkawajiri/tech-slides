#!/usr/bin/env node
// Marp スライドの各ページで要素がはみ出していないかチェックする
// Usage: node scripts/check-overflow.mjs [dir]
//   例: node scripts/check-overflow.mjs 2026-03-19

import { chromium } from "playwright";
import { execFileSync } from "child_process";
import { resolve } from "path";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/check-overflow.mjs <dir>");
  process.exit(1);
}

const slidePath = resolve(dir, "slides.md");
const outPath = resolve("dist", dir, "index.html");

// ビルド
console.log(`Building ${slidePath} ...`);
execFileSync("npx", ["marp", slidePath, "-o", outPath], { stdio: "inherit" });

// HTTP サーバー起動
const { createServer } = await import("http");
const { readFileSync, existsSync, statSync } = await import("fs");
const { join, extname } = await import("path");

const root = process.cwd();
const mimeTypes = {
  ".html": "text/html",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".css": "text/css",
  ".js": "application/javascript",
};

const server = createServer((req, res) => {
  const filePath = join(root, decodeURIComponent(req.url));
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = extname(filePath);
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  res.end(readFileSync(filePath));
});

await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;
const url = `http://localhost:${port}/dist/${dir}/index.html`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(url, { waitUntil: "networkidle" });

// スライド枚数を取得
const totalSlides = await page.evaluate(() => {
  return document.querySelectorAll("svg > foreignObject > section").length;
});
console.log(`Total slides: ${totalSlides}\n`);

let hasOverflow = false;

for (let i = 0; i < totalSlides; i++) {
  // Marp はハッシュでスライド移動
  await page.goto(`${url}#${i + 1}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);

  const result = await page.evaluate((slideIndex) => {
    const sections = document.querySelectorAll(
      "svg > foreignObject > section"
    );
    const section = sections[slideIndex];
    if (!section) return { error: "Section not found" };

    // section の表示領域
    const sectionH = section.clientHeight;

    // 子要素の合計的なはみ出しチェック
    const issues = [];
    for (const child of section.children) {
      const rect = child.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const relativeBottom = rect.bottom - sectionRect.top;
      const relativeRight = rect.right - sectionRect.left;

      if (relativeBottom > sectionH + 2) {
        issues.push({
          tag: child.tagName.toLowerCase(),
          text: child.textContent?.slice(0, 50).trim(),
          overflowY: Math.round(relativeBottom - sectionH),
        });
      }
      if (relativeRight > section.clientWidth + 2) {
        issues.push({
          tag: child.tagName.toLowerCase(),
          text: child.textContent?.slice(0, 50).trim(),
          overflowX: Math.round(relativeRight - section.clientWidth),
        });
      }
    }

    // scrollHeight による全体チェック
    const scrollOverflow = section.scrollHeight > sectionH + 2;

    return { sectionH, scrollOverflow, issues };
  }, i);

  const slideNum = i + 1;
  const hasIssues = result.scrollOverflow || result.issues?.length > 0;

  if (hasIssues) {
    hasOverflow = true;
    console.log(`❌ Slide ${slideNum}: OVERFLOW detected`);
    if (result.scrollOverflow) {
      console.log(`   scrollHeight exceeds clientHeight`);
    }
    for (const issue of result.issues || []) {
      if (issue.overflowY) {
        console.log(
          `   <${issue.tag}> overflows bottom by ${issue.overflowY}px: "${issue.text}"`
        );
      }
      if (issue.overflowX) {
        console.log(
          `   <${issue.tag}> overflows right by ${issue.overflowX}px: "${issue.text}"`
        );
      }
    }
  } else {
    console.log(`✅ Slide ${slideNum}: OK`);
  }
}

await browser.close();
server.close();

if (hasOverflow) {
  console.log("\n⚠️  Some slides have overflow issues.");
  process.exit(1);
} else {
  console.log("\n✅ All slides fit within bounds.");
}
