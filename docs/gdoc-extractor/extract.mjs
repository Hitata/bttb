#!/usr/bin/env node

/**
 * Google Doc Extractor
 *
 * Extracts text from a Google Doc (even with copy disabled) using the /mobilebasic view.
 *
 * Usage:
 *   node extract.mjs <google-doc-url> [output.md]
 *
 * Examples:
 *   node extract.mjs "https://docs.google.com/document/d/ABC123/edit" output.md
 *   node extract.mjs "https://docs.google.com/document/d/ABC123/edit" > output.md
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";

const url = process.argv[2];
const outputFile = process.argv[3];

if (!url) {
  console.error("Usage: node extract.mjs <google-doc-url> [output.md]");
  process.exit(1);
}

// Extract doc ID from URL
const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
if (!match) {
  console.error("Error: Could not extract document ID from URL");
  process.exit(1);
}

const docId = match[1];
const mobileUrl = `https://docs.google.com/document/d/${docId}/mobilebasic`;

async function extract() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.error(`Fetching: ${mobileUrl}`);
  await page.goto(mobileUrl, { waitUntil: "domcontentloaded" });

  const title = await page.title();
  console.error(`Document: ${title}`);

  // Extract text and heading structure
  const content = await page.evaluate(() => {
    const docContent = document.querySelector(".doc-content");
    if (!docContent) return document.body.innerText;

    const result = [];
    const walk = (el) => {
      for (const child of el.children) {
        const tag = child.tagName.toLowerCase();
        const text = child.innerText?.trim();
        if (!text) continue;

        if (tag === "h1") result.push(`# ${text}\n`);
        else if (tag === "h2") result.push(`## ${text}\n`);
        else if (tag === "h3") result.push(`### ${text}\n`);
        else if (tag === "h4") result.push(`#### ${text}\n`);
        else if (tag === "h5") result.push(`##### ${text}\n`);
        else if (tag === "h6") result.push(`###### ${text}\n`);
        else if (tag === "table") {
          // Basic table extraction
          const rows = child.querySelectorAll("tr");
          rows.forEach((row, i) => {
            const cells = [...row.querySelectorAll("td, th")].map(
              (c) => c.innerText?.trim() || ""
            );
            result.push(`| ${cells.join(" | ")} |`);
            if (i === 0) {
              result.push(`| ${cells.map(() => "---").join(" | ")} |`);
            }
          });
          result.push("");
        } else if (tag === "ul" || tag === "ol") {
          const items = child.querySelectorAll("li");
          items.forEach((li, i) => {
            const prefix = tag === "ol" ? `${i + 1}.` : "-";
            result.push(`${prefix} ${li.innerText?.trim()}`);
          });
          result.push("");
        } else if (tag === "p" || tag === "div") {
          result.push(text);
          result.push("");
        }
      }
    };

    walk(docContent);
    return result.join("\n");
  });

  await browser.close();

  // Clean up excessive blank lines
  const cleaned = content.replace(/\n{4,}/g, "\n\n\n");

  if (outputFile) {
    writeFileSync(outputFile, cleaned);
    console.error(`Saved to: ${outputFile} (${cleaned.length} chars)`);
  } else {
    process.stdout.write(cleaned);
  }
}

extract().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
