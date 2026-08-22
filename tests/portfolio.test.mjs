import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  return readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
}

test("statically exports Devarsh's portfolio", async () => {
  const html = await render();
  assert.match(html, /<title>Devarsh Vasa — Java Backend Engineer<\/title>/i);
  assert.match(html, /I write Java/);
  assert.match(html, /stay curious/);
  assert.match(html, /Application Engineer/);
  assert.match(html, /Oracle India/);
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
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/og\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.doesNotMatch(html, /href=["']tel:|telephone|phone/i);
});
