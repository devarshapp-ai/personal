import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  return readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
}

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("statically exports Devarsh's portfolio", async () => {
  const html = await render();
  assert.match(html, /<title>Devarsh Vasa — Java Backend Engineer<\/title>/i);
  assert.match(html, /I write Java/);
  assert.match(html, /stay curious/);
  assert.match(html, /Application Engineer/);
  assert.match(html, /Oracle India/);
  assert.match(html, /Oracle Fusion SCM Procurement/);
  assert.match(html, /MEDplat/);
  assert.match(html, /medplat-logo\.png/);
  assert.match(html, /Unlock the premium version of Devarsh/);
  assert.match(html, /devarsh\.jobs@gmail\.com/);
  assert.match(html, /Spring Boot/);
  assert.match(html, /Strength training/);
  assert.doesNotMatch(html, /Lifeline ambulance|Video chat application|Mentored 5 interns/);
  assert.doesNotMatch(html, /href=["']tel:|Confidential/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("renders privacy-safe social metadata", async () => {
  const html = await render();

  assert.match(html, /property="og:title" content="Devarsh Vasa — Java Backend Engineer"/);
  assert.match(
    html,
    /property="og:image" content="(?:https:\/\/devarsh\.online|http:\/\/localhost:3000)\/og\.png"/,
  );
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /rel="icon"[^>]+favicon\.png/i);
  assert.match(html, /rel="apple-touch-icon"[^>]+favicon\.png/i);
  assert.match(html, /class="hero-portrait"[^>]+devarsh-midnight\.webp/i);
  assert.doesNotMatch(html, /portrait-placeholder|devarsh-blue\.webp|devarsh-profile\.webp|devarsh-editorial\.png|devarsh-kumar\.png|devarsh-front\.png/i);
  assert.doesNotMatch(html, /href=["']tel:|telephone|phone/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /"@type":"Person"/i);
});

test("uses restrained hero and scroll motion with reduced-motion support", async () => {
  const [page, styles] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);

  assert.doesNotMatch(page, /hero-marquee/);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /scroll-reveal/);
  assert.match(styles, /\.scroll-motion-ready \.scroll-reveal/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.hero-art\s*\{[^}]*perspective:/s);
});

test("publishes crawler discovery files for the custom domain", async () => {
  const [robots, sitemap] = await Promise.all([
    source("public/robots.txt"),
    source("public/sitemap.xml"),
  ]);
  assert.match(robots, /Sitemap: https:\/\/devarsh\.online\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/devarsh\.online\/<\/loc>/);
});

test("keeps the custom cursor stable and visible on the accent panel", async () => {
  const [page, styles] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);

  assert.match(page, /requestAnimationFrame\(renderCursor\)/);
  assert.match(page, /ring\.style\.transform = position/);
  assert.match(page, /closest\("\.contact-panel"\)/);
  assert.match(page, /classList\.toggle\("is-on-accent"/);
  assert.match(styles, /\.cursor-dot\.is-on-accent\s*\{[^}]*background:\s*var\(--ink\)/s);
  assert.match(styles, /\.cursor-ring\.is-on-accent\s*\{[^}]*border-color:/s);
});

test("integrates the portrait cleanly and hides only the visual scrollbar", async () => {
  const styles = await source("app/globals.css");

  assert.match(styles, /scrollbar-width:\s*none/);
  assert.match(styles, /body::-webkit-scrollbar/);
  assert.match(styles, /\.hero-portrait\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5[^}]*border-radius:\s*18px 18px 96px 96px/s);
  assert.match(styles, /\.trace-card\s*\{[^}]*right:\s*1%/s);
});

test("animates impact percentages as their cards enter the viewport", async () => {
  const [page, styles] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);

  assert.match(page, /impact-number/);
  assert.match(page, /data-target="75"/);
  assert.match(page, /requestAnimationFrame\(count\)/);
  assert.match(styles, /\.impact-meter i/);
  assert.match(styles, /article\.is-visible \.impact-meter i/);
});

test("keeps the beyond-work cards aligned and omits the old education note", async () => {
  const [html, styles] = await Promise.all([render(), source("app/globals.css")]);

  assert.doesNotMatch(html, /BE in Computer Engineering|LDRP ITR/);
  assert.match(styles, /\.interest-grid article\s*\{[^}]*grid-template-rows:/s);
  assert.match(styles, /\.interest-grid small\s*\{[^}]*min-height:/s);
});

test("does not load mutable third-party analytics JavaScript", async () => {
  const page = await source("app/page.tsx");
  assert.doesNotMatch(page, /gc\.zgo\.at\/count\.js/);
  assert.match(page, /goatcounter\.com/);
  assert.match(page, /\/counter\/.*\.json/);
  assert.match(page, /encodeURIComponent\(counterPath\)/);
  assert.doesNotMatch(page, /encodeURIComponent\("TOTAL"\)/);
});
