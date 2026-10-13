#!/usr/bin/env node
/**
 * Renders previews/*.html in headless Chromium for a quick layout check.
 * This is NOT an email-client test (see testing-plan.md); it only verifies the
 * HTML/CSS is well-formed and the fluid layout behaves at desktop and phone widths.
 *   node scripts/screenshot.mjs
 */
import { readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Resolve playwright from this project, or from a global install given via PLAYWRIGHT_PATH.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const previews = resolve(root, 'previews');
const files = readdirSync(previews).filter((f) => f.endsWith('.html'));
const browser = await chromium.launch();
for (const f of files) {
  for (const [label, width, scheme] of [['desktop', 720, 'light'], ['mobile', 375, 'light'], ['desktop-dark', 720, 'dark']]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
    await page.goto('file://' + resolve(previews, f));
    const out = resolve(previews, f.replace('.html', `.${label}.png`));
    await page.screenshot({ path: out, fullPage: true });
    console.log('wrote', out);
    await page.close();
  }
}
await browser.close();
