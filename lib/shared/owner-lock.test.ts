import { test } from "node:test";
import assert from "node:assert/strict";
import { ownerToken, safeEqual, PAID_PATHS } from "./owner-lock";

test("ownerToken is stable and password-specific", async () => {
  const a = await ownerToken("rose");
  assert.equal(a, await ownerToken("rose"));
  assert.notEqual(a, await ownerToken("Rose"));
  assert.equal(a.length, 64);
});

test("safeEqual", () => {
  assert.ok(safeEqual("abc", "abc"));
  assert.ok(!safeEqual("abc", "abd"));
  assert.ok(!safeEqual("abc", "ab"));
});

test("free audit route is not locked", () => {
  assert.ok(!PAID_PATHS.has("/api/audit"));
  assert.ok(PAID_PATHS.has("/api/scrape"));
});
